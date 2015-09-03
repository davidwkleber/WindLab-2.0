/*
#### change log####
version 1.0.7beta
+Speed Encoder for rpm measurement

version 1.0.6
.changed datastrings to strings with constant length

version 1.0.5
+own analog read function

version 1.0.4
.changed: readVcc just once before the other ADC reads start -> saves some conversion time


version 1.0.3
.changed ADC Prescaler to 64 (=>250kHz ADC Clock) -> ,ore stable readings
.commented out unused stuff and commands

version 1.0.2
.changed back to continuous timestamp


version 1.0.1
.change to delta time instead of continuous time for timestamp
.on restart Help massage is displayed
.minor cosmetic changes

version 1.0
code freeze from development

*/

/*
#include <JsonGenerator.h>
#include <JsonParser.h>

using namespace ArduinoJson::Generator;
*/
#include <avr/interrupt.h>

// header definitions
boolean DEBUG=false;
String version ="1.0.7beta";
static long buad = 115200;



// ADC MOde Setting
#define FASTADC 1
// defines for setting and clearing register bits
#ifndef cbi
#define cbi(sfr, bit) (_SFR_BYTE(sfr) &= ~_BV(bit))
#endif
#ifndef sbi
#define sbi(sfr, bit) (_SFR_BYTE(sfr) |= _BV(bit))
#endif


//Variables for ADC readings
long readA0;
long readA1;
long readA2;


int readAnalog;


//Variables for Serial Communication
String msg = "HH";


//Variables for time reading
volatile unsigned long lastTime = 0;
volatile unsigned long currTime= 0;
long Power =0;
volatile unsigned long currTime1 = 0;
volatile unsigned long currTime2 = 0;
volatile unsigned long meassureTime = 0;

//Variables for Encoder reading and calculations
volatile int			counts		=	0;
volatile int			last_counts	=	0;
volatile unsigned long	last_micros	=	0;
volatile long			rpm			=	0;
static int				testpin		=	0x80;	//PD7 (Arduino Digital Port #7; Measurement Board Pin 11)
static int				dirPin		=	0x08;	//PD3 (INT1; Arduino Digital Port #3; Measurement Board Pin 1
volatile int			dir			=	0;
volatile int			dir1		=	0;
volatile int			p		=	0;
volatile int			dir_before	=	0;
volatile int			stats		=	0;

//volatile int rpm_array[4] = {0,0,0,0};
//volatile long			counts_mean;




long readVcc() {
	/* Source: https://code.google.com/p/tinkerit/wiki/SecretVoltmeter */
	long result;
	//! Read 1.1V reference against AVcc
	ADMUX = _BV(REFS0) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
	delay(2); //! Wait for Vref to settle
	ADCSRA |= _BV(ADSC); //! Convert
	while (bit_is_set(ADCSRA,ADSC));
	result = ADCL;
	result |= ADCH<<8;
	/* Back-calculate AVcc in mV.
	* V_Bandgap is approx. 1.119505859375V on my Arduino (labeled: MAIK)
	* V_Bandgap for Loadcontrollerboard: 1.08609275 => 1112159L
	* V_Bandgap for Measurementboard: 1.111953125 => 1138640L
	*/
	result = 1138640L/result;
	if(DEBUG)
	{
		Serial.print("Vcc: ");
		Serial.println(result);
	}
	
	/*
	/result returns is in mV (Millivolt)
	*/
	
	return result;
}

int adcReadA0()
{
	int result;
	ADMUX = (1<<REFS0) ;
	//ADCSRA = (1<<ADEN) | (1<<ADSC);
	ADCSRA |= (1<<ADEN) |(1<<ADSC);
	delayMicroseconds(1500);
	while(bit_is_set(ADCSRA,ADSC));
	result = ADCL;
	result |=ADCH<<8;
	//ADCSRA |= (0<<ADEN)
	return result;
}

int adcReadA1()
{
	int result;
	ADMUX = (1<<REFS0) | (1 << MUX0);;
	ADCSRA |= (1<<ADEN) | (1<<ADSC);
	delayMicroseconds(1500);
	while(bit_is_set(ADCSRA,ADSC));
	result =ADCL;
	result |=ADCH<<8;
	return result;
}

int adcReadA2()
{
	int result;
	ADMUX = (1<<REFS0) | (1 << MUX1);
	ADCSRA |= (1<<ADEN) | (1<<ADSC);
	delayMicroseconds(1500);
	while(bit_is_set(ADCSRA,ADSC));
	result =ADCL;
	result |=ADCH<<8;
	return result;
}


long toVolt(int reading, long Vcc)
{
	//! Converts the ADC reading to Voltage.
	//! Consider the actual Supply voltage and the Voltage divider factor of 5
	///return returns milliVolts
	if (DEBUG)
	{
		Serial.print("V_raw: ");
		Serial.println(reading);
	}
	return long(Vcc*reading*5/1024);
	
}

long toCurrent(int reading, long Vcc)
{
	//! Converts the ADC reading to Current.
	//! Consider the actual Supply voltage
	///return returns milliAmps
	if (DEBUG)
	{
		Serial.print("I_raw: ");
		Serial.println(reading);
	}
	return long(Vcc*reading/1024);
	
}

long toRPM(int reading, long Vcc)
{
	//! Converts the ADC reading to RPM.
	//! Consider the actual Supply voltage and the Voltage divider factor of 5
	///return returns rpm
	
	long Voltage=Vcc*reading*5/1024; //! Voltage in milliVolts
	if (DEBUG)
	{
		
		Serial.print("N_raw: ");
		Serial.println(reading);
		Serial.print("Volts_RPM: ");
		Serial.println(Voltage);
	}
	long rpm = round(Voltage/1.5);		//! Conversion from Volts to rpm
	
	return rpm;
}



String constTimeStringLengthOf10(unsigned long timestamp)
{
	char charBuffer[11+1];
	
	sprintf(charBuffer,"%10lu",timestamp);
	return String(charBuffer);
}

String constRPMStringLengthOf7(long value)
{
	char charBuffer[11+1];
	
	sprintf(charBuffer,"%10ld",value);
	return String(charBuffer);
}

String constVoltStringLengthOf5(long value)
{
	char charBuffer[6+1];
	
	sprintf(charBuffer,"%5ld",value);
	return String(charBuffer);
}

String constCurrStringLengthOf4(long value)
{
	char charBuffer[5+1];
	
	sprintf(charBuffer,"%4ld",value);
	return String(charBuffer);
}


long enc_rpm()
{
	//PORTD ^= (1<<PORTD7);
	//PORTD |=testpin;			//PD7 as trigger out set to HIGH
	//last_micros=micros();
	//Serial.print("dir ");
	//Serial.println(dir);
	//Serial.print("lm ");
	//Serial.println(last_micros);
	//Serial.print("m ");
	//Serial.println(micros());
	
	enableCounter();
	dir=0;
	
	
	counts=0;
	last_micros=micros();
	
	PORTD |=testpin;			//PD7 as trigger out set to HIGH
	while(micros()-last_micros <=7000){
		while(micros()-last_micros >=5000) // counts for 0,005 s measured timespan  s
		{

			PORTD &= !testpin;			//PD7 as trigger out set to LOW
			dir1=dir;
			
			 //smooths fluctuations in dirPin reading (not necessary anymore, problem solved via hardware)
			if (dir1!=dir_before & stats<=7)
			{
			stats++;
			dir1=-1*dir1;
			}
			else if (dir1!=dir_before & stats>7)
			{
			stats=0;
			}
			
			if (dir1==-1 || dir1==1 || dir1==0)
			{

				////5 Sample Moving Average To Smooth Out The Data
				//rpm_array[0] = rpm_array[1];
				//rpm_array[1] = rpm_array[2];
				//rpm_array[2] = rpm_array[3];
				//rpm_array[3] = counts;
				////rpm_array[4] = rpm_array[5];
				////rpm_array[5] = counts;
				////Last 5 Average RPM Counts Equals....
				//counts_mean = ((rpm_array[0] + rpm_array[1] + rpm_array[2] + rpm_array[3])>>2);  // rightshift 2 equals division by 4
				//rpm = long(dir1)*long(counts_mean) * 5861; // (counts)*(1/measured timespan)*60s/1024 //
				rpm = long(dir1)*long(counts) * 11696;//5848*2; // (counts)*(1/measured timespan)*60s/1024 //
				disableCounter();
				if(DEBUG)
				{
					Serial.print(counts);
					Serial.print(", ");
					Serial.print(dir1);
					Serial.print(", ");
					Serial.println(rpm,DEC);
				}
				
				counts=0;
				//rpm=0;
				//dir=3;
				dir_before=dir1;
				last_micros=0;
				break;
				
			}
			//PORTD &= !testpin;			//PD7 as trigger out set to LOW
			return rpm; // in milli RPM (rpm*1000)
			
		}
		if (micros() -last_micros>=6000)
		{
			return rpm;
		}
		
	}
	
}

void enableCounter()
{
	// Turns on INT0
	EIMSK |= (1<< INT0);				
}

void disableCounter()
{
	// Turns on INT0
	EIMSK = (0<< INT0);
	
}


void setup()
{
	//Set Testpin as digital output
	DDRD|=testpin;
	
	//Setup a defined status for Timer1
	TCCR1A = 0;
	TCCR1B = 0;
	TCNT1  = 0;
	
	//Interrupt setup
	EICRA |= (1<< ISC00) | (1<< ISC01);	// set INT0 (Arduino Port 2; Measurement Board Pin 32) to trigger on rising edge
	//EIMSK |= (1<< INT0);				// Turns on INT0
	
	// self explaining
	#if FASTADC
	//! set prescale to 64
	sbi(ADCSRA,ADPS2);
	sbi(ADCSRA,ADPS1);
	cbi(ADCSRA,ADPS0);
	#endif
	
	//Setup 16bit Timer1
	TCCR1B =(1<<WGM12);  //set CTC Bit
	OCR1A = 625;	// Sets a Time frame of 0.100s for measuring the speed
	
	//Enable Interrupts on timer
	//TIMSK1 = (1<<OCIE1A) ;//| (1<<TOIE0) ;
	
	
	//enable interrupts
	sei();
	
	////Set prescaler to 256 for Timer1 and enables
	//TCCR1B  |= (1<<CS12) | (0<<CS11) | (0<<CS10) ;
	
	//! Initialize Serial Communication
	Serial.begin(buad);
	Serial.println("Ready");
	//last_micros=micros();

}





void loop()
{

	
	//! Read the Serial Data in for the commands
	if(Serial.available()>0)
	{
		msg="";
		while(Serial.available()>0)
		{
			msg+=char(Serial.read());
			delay(10);
		}
		msg = msg.substring(0,2);
		msg.toUpperCase();
		//serial.print("msg: ");
		//serial.println(msg);
	}
	

	//! Definition of the Serial Commands and the send back Data
	if (msg.equals("DD"))
	{
		
		DEBUG=!DEBUG;
		msg= "AA";
		if (DEBUG)
		{
			Serial.println("Debug: On");
			
		}
		else
		{
			Serial.println("Debug: Off");
			
		}
		
	}
	

	else if (msg.equals("AA"))
	{
		currTime2 = micros();
		long VCC = readVcc();
		readA0=toVolt(adcReadA0(),VCC);		//in mV
		//delay(2);
		readA1=toCurrent(adcReadA1(),VCC);	//in mA
		//delay(2);
		//readA2=toRPM(adcReadA2(),VCC);
		//PORTD |=testpin;			//PD7 as trigger out set to HIGH
		readA2=enc_rpm();					//in milli rpm (rpm*1000)
		//PORTD &= !testpin;			//PD7 as trigger out set to LOW
		counts=0;
		//rpm=0;
		
		
		/*/////
		//Set prescaler to 256 for Timer1 and enables
		unsigned long tim =micros();
		TCCR1B  |= (1<<CS12) | (0<<CS11) | (0<<CS10) ;
		while (tim-micros()<=1000)
		{
			
			
		//counts for 0,01 s measured timespan 0,01002 s
		dir1=dir;
		readA2=long(dir1)*long(last_counts) * 5848; // rpm = (counts)*(1/measured timespan)*60s/1024 //// in milli RPM (rpm*1000);last_counts;
		}
		
		//Set prescaler to 0 for Timer1 and disables
		TCCR1B  |= (0<<CS12) | (0<<CS11) | (0<<CS10) ;
		*/////
		
		
		//delay(2);
		Power =readA0*readA1/1000;		//>in milliWatt
		//currTime = currTime2;
		//! Start Time measurement for measuring the loop length
		
		
		if(!DEBUG)
		{
			
			//JSON Output
			Serial.println("{");
				Serial.print("\t\"voltage\": ");
				Serial.print(constVoltStringLengthOf5(readA0));
				Serial.println(",");
				Serial.print("\t\"current\": ");
				Serial.print(constCurrStringLengthOf4(readA1));
				Serial.println(",");
				Serial.print("\t\"rpm\": ");
				Serial.print(constRPMStringLengthOf7(readA2));
				Serial.println(",");
				Serial.print("\t\"power\": ");
				Serial.print(constCurrStringLengthOf4(Power));
				Serial.println(",");
				Serial.print("\t\"timestamp\": ");
				Serial.println(constTimeStringLengthOf10(currTime2));
			Serial.println("}");
			Serial.println("EOL");
		}
		else
		{
			//Raw data output
			Serial.print("V: ");
			Serial.print(readA0);
			Serial.print("; ");
			Serial.print("I: ");
			Serial.print(readA1);
			Serial.print("; ");
			Serial.print("N: ");
			Serial.print(readA2);
			Serial.print("; ");
			Serial.print("t: ");
			Serial.println(currTime2);

		}

		
	}
	else if (msg.equals("HH"))
	{
		//Help Massage
		Serial.println("Measurement Board");
		Serial.print("Firmware Version: ");
		Serial.println(version);
		Serial.println("Commands:");
		Serial.println("HH : prints this massage");
		Serial.println("AA : print Volt, Current, RPM, Power and a Timestamp (since last restart) in actual Units ([mV],[mA],[1/min],[mW],[us])");
		Serial.println("     Output is in JSON Style!!!");
		//Serial.println("Ax : prints only Analog Pin x (bit value (x: 0-5))");
		Serial.println("DD : toggle debug mode on and off");
		msg="";
		
		
		
	}
	else
	{
		msg="";
		disableCounter();
	}

}

ISR(TIMER1_COMPA_vect)
{
	//PORTD ^= (1<<PORTD7);
	//Timeframe of 10ms for measurement
	//PORTD |=testpin;			//PD7 as trigger out set to HIGH
	//dir1=dir-3;
	
	last_counts = counts;

	
	//if(DEBUG)
	//{
		//Serial.print(counts);
		//Serial.print(", ");
		//Serial.print(dir1);
		//Serial.print(", ");
		//Serial.println(rpm,DEC);
	//}
	
	counts=0;
	//rpm=0;
	//dir=3;
	//dir_before=dir1;
	//PORTD &= !testpin;			//PD7 as trigger out set to LOW
}//end.ISR

ISR (INT0_vect)		// external pin interrupt on rising edge counts the interrupts
{
	//PORTD ^= (1<<PORTD7);
	//PORTD |=testpin;			//PD7 as trigger out set to HIGH
	p = PIND & dirPin ;		//PB1 digital read
	
	
	if (p)						//check Encoder channel B for status as direction detection
	{
		dir=1;					// crude direction numbers as a try for compilation improvement (weired stuff...); calculates later to -1,0 and 1
	}
	else if(!p)
	{
		dir=-1;
	}
	else
	{
		dir=0;
	}
	counts++;					//rpm counter
	
	//PORTD &= !testpin;			//PD7 as trigger out set to LOW
}