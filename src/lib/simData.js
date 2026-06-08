import { RACEROOM_CARS, RACEROOM_TRACKS, RACEROOM_SETUP_PARAMS } from './simDataRaceRoom.js';

export const SIM_TITLES = [
  "iRacing",
  "Assetto Corsa Competizione",
  "Assetto Corsa",
  "Assetto Corsa Evo",
  "Le Mans Ultimate",
  "Automobilista 2",
  "Gran Turismo 7",
  "R Factor 2",
  "RaceRoom"
];

// ─────────────────────────────────────────────
// CAR LISTS — fully expanded per sim
// ─────────────────────────────────────────────
export const CAR_LISTS = {
  "iRacing": {
    "GT3": [
      "Audi R8 LMS EVO II GT3",
      "BMW M4 GT3",
      "Chevrolet Corvette Z06 GT3.R",
      "Ferrari 296 GT3",
      "Ford Mustang GT3",
      "Lamborghini Huracán GT3 EVO2",
      "McLaren 720S GT3 EVO",
      "Mercedes-AMG GT3 EVO 2020",
      "Porsche 911 GT3 R (992)"
    ],
    "GT4": [
      "Aston Martin Vantage GT4",
      "BMW M4 GT4",
      "McLaren 570S GT4",
      "Mercedes-AMG GT4",
      "Porsche 718 Cayman GT4",
      "Toyota GR86 GT4"
    ],
    "GTE": [
      "Chevrolet Corvette C8.R GTE",
      "Ferrari 488 GT3 EVO (GTE Spec)",
      "Ford GT GTE",
      "Porsche 911 RSR (991.2)"
    ],
    "GTP / LMDh": [
      "Acura ARX-06 GTP",
      "BMW M Hybrid V8",
      "Cadillac V-Series.R GTP",
      "Porsche 963 GTP"
    ],
    "LMP2": [
      "Dallara P217 LMP2"
    ],
    "Touring / TCR": [
      "Audi RS 3 LMS TCR",
      "Honda Civic Type R TCR",
      "Hyundai Elantra N TC",
      "Volkswagen Golf GTI TCR"
    ],
    "Open Wheel": [
      "Dallara F3 (2019)",
      "Dallara iR-04 (Formula iRacing)",
      "Dallara F2 (2018)",
      "Formula Vee (1600)",
      "IndyCar IR-18",
      "Super Formula SF23",
      "Williams FW31 (F1 2009)",
      "Porsche TAG Turbo (F1 1987)",
      "Skip Barber Formula 2000"
    ],
    "Mazda": [
      "Mazda MX-5 Cup",
      "Mazda MX-5 Mx-5 (Spec Racer)"
    ],
    "NASCAR Cup": [
      "NASCAR Next Gen Camaro ZL1",
      "NASCAR Next Gen Mustang",
      "NASCAR Next Gen Camry"
    ],
    "NASCAR Xfinity": [
      "NASCAR Xfinity Camaro",
      "NASCAR Xfinity Mustang",
      "NASCAR Xfinity Supra"
    ],
    "NASCAR Truck": [
      "NASCAR Truck Silverado",
      "NASCAR Truck Tundra",
      "NASCAR Truck F-150"
    ],
    "Oval / Dirt": [
      "Late Model Stock Car",
      "Super Late Model",
      "Sprint Car Non-Wing (305)",
      "Sprint Car 410 Wing",
      "Dirt Midget",
      "Dirt Late Model",
      "Legend Car (1990s Ford Thunderbird)",
      "Street Stock"
    ],
    "Radical / Sports": [
      "Radical SR10"
    ]
  },

  "Assetto Corsa Competizione": {
    "GT3": [
      "Aston Martin Vantage V8 GT3 (2019)",
      "Aston Martin Vantage GT3 AMR (2022)",
      "Audi R8 LMS GT3 EVO (2019)",
      "Audi R8 LMS GT3 EVO II (2022)",
      "Bentley Continental GT3 (2018)",
      "Bentley Continental GT3 (2020)",
      "BMW M4 GT3 (2022)",
      "BMW M6 GT3 (2017)",
      "Emil Frey Jaguar G3 (2012)",
      "Ferrari 296 GT3 (2023)",
      "Ferrari 488 GT3 EVO (2020)",
      "Honda NSX GT3 EVO (2019)",
      "Lamborghini Huracán GT3 EVO (2019)",
      "Lamborghini Huracán GT3 EVO2 (2023)",
      "Lexus RC F GT3 (2016)",
      "McLaren 720S GT3 EVO (2023)",
      "McLaren 650S GT3 (2015)",
      "Mercedes-AMG GT3 EVO (2020)",
      "Nissan GT-R Nismo GT3 (2018)",
      "Porsche 911 GT3 R (991 II) (2019)",
      "Porsche 911 GT3 R (992) (2023)",
      "Reiter Engineering R-EX GT3"
    ],
    "GT4": [
      "Alpine A110 GT4",
      "Aston Martin Vantage AMR GT4",
      "Audi R8 LMS GT4",
      "BMW M4 GT4",
      "Chevrolet Camaro GT4.R",
      "Ginetta G55 GT4",
      "KTM X-Bow GT4",
      "Maserati MC GT4",
      "McLaren 570S GT4",
      "Mercedes-AMG GT4",
      "Porsche 718 Cayman GT4 MR"
    ],
    "GT2": [
      "Audi R8 LMS GT2",
      "KTM X-Bow GT2",
      "Maserati MC20 GT2",
      "Mercedes-AMG GT2",
      "Porsche 911 GT2 RS CS Evo"
    ],
    "Cup Cars": [
      "Ferrari 488 Challenge EVO",
      "Lamborghini Huracán ST (2015)",
      "Lamborghini Huracán ST EVO2 (2023)",
      "Porsche 992 GT3 Cup"
    ],
    "TCX": [
      "BMW M2 CS Racing"
    ]
  },

  "Assetto Corsa": {
    "GT3": [
      "Audi R8 LMS Ultra",
      "BMW Z4 GT3",
      "Ferrari 458 GT3",
      "Ferrari 458 Italia GT3 (2012)",
      "Lamborghini Huracán GT3",
      "McLaren 650S GT3",
      "Mercedes SLS AMG GT3",
      "Nissan GT-R Nismo GT3",
      "Porsche 911 GT3 R (991)"
    ],
    "GTE / GT2": [
      "Ferrari 458 Italia GTE",
      "Porsche 911 RSR (991)",
      "BMW M3 GT2 (E92)",
      "Chevrolet Corvette C7.R"
    ],
    "LMP1": [
      "Audi R18 e-tron quattro (2014)",
      "Toyota TS040 Hybrid (2014)",
      "Porsche 919 Hybrid Evo (2017)"
    ],
    "LMP2": [
      "Ligier JS P2 Honda",
      "Morgan LMP2 Judd"
    ],
    "GT4": [
      "BMW M4 GT4 (F82)",
      "Maserati Gran Turismo MC GT4"
    ],
    "Touring / WTCC": [
      "Honda Civic WTCC 2014",
      "BMW M3 E30 Group A",
      "Ford Sierra RS500 Cosworth",
      "Alfa Romeo 155 Ti V6 DTM",
      "BMW 320si WTCC 2006"
    ],
    "Open Wheel": [
      "Dallara F312",
      "Formula Abarth",
      "Lotus 98T Formula 1 (1986)",
      "Ferrari 312T Formula 1 (1975)",
      "Tatuus FA 010 (Formula Abarth)"
    ],
    "GT Sport / Road": [
      "Ferrari 458 Italia",
      "Ferrari 599 GTB Fiorano",
      "Ferrari F40",
      "Ferrari 599XX EVO",
      "Lamborghini Huracán LP610-4",
      "Lamborghini Aventador LP700-4",
      "Lamborghini Sesto Elemento",
      "McLaren P1",
      "McLaren MP4-12C",
      "Pagani Huayra",
      "Pagani Zonda R",
      "Porsche 918 Spyder",
      "Lotus Exige 240R",
      "Lotus Exige S Roadster",
      "Lotus Evora GTC",
      "KTM X-Bow R",
      "Alfa Romeo 4C",
      "BMW M4 (F82)",
      "BMW 1M Coupe",
      "Abarth 500 Assetto Corse",
      "Shelby Cobra 427 S/C"
    ]
  },

  "Assetto Corsa Evo": {
    "GT3 (2024 Spec)": [
      "Audi R8 LMS GT3 EVO II",
      "BMW M4 GT3",
      "Ferrari 296 GT3",
      "Lamborghini Huracán GT3 EVO2",
      "McLaren 720S GT3 EVO",
      "Mercedes-AMG GT3 EVO",
      "Porsche 911 GT3 R (992)"
    ],
    "GTE": [
      "Ferrari 488 GTE Evo",
      "Porsche 911 RSR-19",
      "Ford GT GTE (2019)"
    ],
    "GT4": [
      "BMW M4 GT4",
      "McLaren 570S GT4",
      "Mercedes-AMG GT4",
      "Porsche 718 Cayman GT4 MR"
    ],
    "Cup Cars": [
      "Porsche 992 GT3 Cup",
      "Ferrari 488 Challenge EVO",
      "Lamborghini Huracán ST EVO2"
    ],
    "Touring": [
      "Honda Civic Type R FK8 (BTCC Spec)",
      "BMW 330e M Sport (BTCC Spec)",
      "Alfa Romeo Giulia GTA M"
    ],
    "Supercars / Road": [
      "Ferrari Roma",
      "Ferrari SF90 Stradale",
      "Lamborghini Huracán EVO",
      "Lamborghini Huracán Tecnica",
      "McLaren 720S",
      "McLaren Artura",
      "Porsche 911 GT3 RS (992)",
      "Porsche 911 Turbo S (992)",
      "BMW M4 Competition (G82)",
      "BMW M2 (G87)",
      "Abarth 500 Assetto Corse",
      "Alfa Romeo Giulia GTA",
      "Toyota GR86",
      "Toyota GR Supra"
    ]
  },

  "Le Mans Ultimate": {
    "Hypercar (LMH / LMDh)": [
      "Toyota GR010 HYBRID",
      "Ferrari 499P",
      "Porsche 963",
      "Cadillac V-Series.R",
      "BMW M Hybrid V8",
      "Alpine A424",
      "Peugeot 9X8 (2023 Spec)",
      "Peugeot 9X8 (2024 Spec, with wing)",
      "Lamborghini SC63",
      "Isotta Fraschini Tipo6 LMH Competizione",
      "Vanwall Vandervell 680",
      "Glickenhaus 007 LMH"
    ],
    "LMP2": [
      "ORECA 07 Gibson",
      "Ligier JS P217 Gibson"
    ],
    "LMGT3 (2024)": [
      "Aston Martin Vantage GT3 AMR",
      "BMW M4 GT3",
      "Chevrolet Corvette Z06 GT3.R",
      "Ferrari 296 GT3",
      "Ford Mustang GT3",
      "Lamborghini Huracán GT3 EVO2",
      "McLaren 720S GT3 EVO",
      "Mercedes-AMG GT3 EVO",
      "Porsche 911 GT3 R (992)",
      "Toyota GR Supra GT3"
    ],
    "GTE (Legacy 2022)": [
      "Ferrari 488 GTE Evo",
      "Porsche 911 RSR-19",
      "Ford GT GTE",
      "Chevrolet Corvette C8.R GTE"
    ]
  },

  "Automobilista 2": {
    "GT3": [
      "Audi R8 LMS GT3 EVO2",
      "BMW M4 GT3",
      "BMW M6 GT3",
      "Chevrolet Camaro GT3.R",
      "Ferrari 488 GT3",
      "Lamborghini Huracán GT3 EVO2",
      "McLaren 720S GT3 EVO",
      "Mercedes-AMG GT3 EVO",
      "Porsche 911 GT3 R (992)"
    ],
    "GT4": [
      "BMW M4 GT4",
      "Ginetta G55 GT4",
      "McLaren 570S GT4",
      "Porsche 718 Cayman GT4",
      "Toyota GR86 GT4"
    ],
    "GTE": [
      "Chevrolet Corvette C7.R",
      "Ford GT GTE",
      "Porsche 911 RSR (991.2)"
    ],
    "LMP": [
      "ORECA 07 LMP2",
      "Dallara P217 LMP2",
      "Metalmoro AJR P3",
      "Ligier JS P320 LMP3"
    ],
    "Prototype / Group C": [
      "Sigma P1 Group C",
      "Porsche 956 Group C",
      "Jaguar XJR-9 Group C",
      "Mercedes C291 Group C"
    ],
    "Cup Cars": [
      "Porsche 992 GT3 Cup",
      "Lamborghini Huracán Super Trofeo EVO2",
      "Ferrari 488 Challenge EVO"
    ],
    "Stock Car Brasil": [
      "Chevrolet Cruze Stock Car V8 (2022)",
      "Toyota Corolla Stock Car V8 (2022)",
      "Chevrolet Cruze Stock Car V8 (2019)",
      "Toyota Corolla Stock Car V8 (2019)"
    ],
    "Copa Truck": [
      "Mercedes-Benz Actros Copa Truck",
      "Volkswagen Constellation Copa Truck",
      "Scania S Copa Truck",
      "Iveco Hi-Way Copa Truck"
    ],
    "Formula": [
      "Formula Ultimate Gen 2 (F1 2022 inspired)",
      "Formula V10 Gen 1 (1998)",
      "Formula V10 Gen 2 (2005)",
      "Formula 3 (Dallara F3 2019)",
      "Formula Reiza (Open Wheel)",
      "Formula Classic Gen 1 (1967)",
      "Formula Classic Gen 2 (1975)",
      "Formula Classic Gen 3 (1979)",
      "Formula Trainer",
      "Super Formula SF14",
      "Super V8"
    ],
    "Touring / Road": [
      "BMW 2002 Turbo (1974)",
      "Caterham 620R",
      "Caterham Supersport",
      "Ginetta G40 Junior",
      "Mini Cooper S (1965)",
      "Opala Stock Car (1970s)",
      "Opala Copa Stock (1986)",
      "Puma GTE",
      "Radical SR3",
      "Ultima GTR 720",
      "Volkswagen Fusca (Beetle)"
    ],
    "Historic F1": [
      "Lotus 49C (1970)",
      "Lotus 72D (1972)",
      "Brabham BT26A (1969)",
      "March 701 (1970)",
      "McLaren M23 (1974)",
      "Tyrrell P34 Six-Wheeler (1977)"
    ],
    "Touring Car Historic": [
      "BMW M3 E30 Group A",
      "Ford Sierra RS500 Cosworth Group A",
      "Mercedes C-Class (2006 DTM)",
      "Alfa Romeo 155 V6 Ti DTM"
    ]
  },

  "RaceRoom": RACEROOM_CARS,

  "Gran Turismo 7": {
    "Gr.1 Prototype": [
      "Toyota GR010 HYBRID Race Car '21",
      "Nissan GT-R LM NISMO Race Car '15",
      "Peugeot L750R Hybrid Race Car",
      "Porsche 919 Hybrid Evo '17",
      "Mazda LM55 Vision Gran Turismo Gr.1",
      "Bugatti Vision Gran Turismo Gr.1",
      "Ferrari Vision Gran Turismo Gr.1",
      "Lamborghini V12 Vision Gran Turismo",
      "Aston Martin Valkyrie AMR Pro (Gr.1 spec)"
    ],
    "Gr.2 Touring Car": [
      "BMW M6 GT3 '16 (Touring Car)",
      "Mercedes-AMG C 63 Touring Car",
      "Audi TT Cup '16 Race Car",
      "Honda Civic Type R (FK2) Race Car",
      "Alfa Romeo 156 2.5 V6 Race Car"
    ],
    "Gr.3 GT Race Car": [
      "Aston Martin V12 Vantage GT3 '12",
      "Audi R8 LMS (2015) Gr.3",
      "BMW M6 GT3 '16 Gr.3",
      "Dodge Viper GTS-R '00 Gr.3",
      "Ferrari 458 Italia GT3 '13",
      "Ferrari F430 GT Race Car",
      "Ford GT Race Car '18",
      "Honda NSX GT3 '17",
      "Jaguar F-Type GT3",
      "Lamborghini Huracán GT3 '15",
      "Lexus RC F GT3 '17",
      "McLaren 650S GT3 '15",
      "Mercedes-AMG GT3 '16",
      "Nissan GT-R Nismo GT3 '18",
      "Porsche 911 RSR (991) '17",
      "Subaru BRZ GT300 '21",
      "Toyota GR86 GT300 '21",
      "Toyota Supra GT500 '97"
    ],
    "Gr.4 GT Car": [
      "Alpine A110 GT4 '18",
      "BMW M4 GT4 '18",
      "Chevrolet Camaro ZL1 1LE (Gr.4)",
      "Honda Civic Type R (FK8) Gr.4",
      "Mazda RX-Vision GT3 Concept (Gr.4)",
      "Mitsubishi Lancer Evo Final Gr.4",
      "Porsche 718 Cayman GT4 Clubsport",
      "Renault Mégane RS Trophy R (Gr.4)",
      "Subaru BRZ (Gr.4)",
      "Toyota GR86 (Gr.4)",
      "Toyota Supra (A90) Gr.4"
    ],
    "Gr.B Rally Car": [
      "Audi Sport Quattro S1 Evo 2 Rally Car",
      "Ford RS200 Rally Car",
      "Lancia Delta S4 Rally Car",
      "MG Metro 6R4 Rally Car",
      "Peugeot 205 Turbo 16 Evo 2 Rally Car"
    ],
    "N100 (Kei Cars)": [
      "Honda Beat '91",
      "Honda Life Step Van '72",
      "Mazda Carol '15",
      "Suzuki Cappuccino '91",
      "Suzuki Swift Sport '17"
    ],
    "N200": [
      "Alfa Romeo MiTo '09",
      "Honda Fit Hybrid '14",
      "Mazda Demio XD Touring '15",
      "MINI Cooper S '05",
      "Toyota Aqua S '14"
    ],
    "N300": [
      "Abarth 595 SS '69",
      "Abarth 695 BiAlberto '19",
      "Honda Civic Type R (EK) '98",
      "Honda Civic Type R (FK7) '17",
      "Honda Integra Type R (DC5) '04",
      "Mazda RX-8 Spirit R '12",
      "Mazda MX-5 Miata (NA) '89",
      "Porsche 718 Cayman '16",
      "Subaru BRZ S '21",
      "Toyota 86 '15",
      "Toyota GR Yaris RZ '20",
      "Toyota GR86 (ZN8) '21",
      "VW Golf VIII GTI '21",
      "VW Polo GTI '14"
    ],
    "N400": [
      "BMW M2 Competition '18",
      "BMW M3 (E46) '03",
      "BMW M4 (G82) Competition '21",
      "Ford Mustang Boss 429 '69",
      "Honda NSX Type R '02",
      "Honda S2000 Type S '08",
      "Mazda RX-7 Spirit R Type A '02",
      "Mercedes-AMG A 45 S '20",
      "Mitsubishi Lancer Evo VI GSR T.M. Ed.",
      "Nissan Skyline GT-R (R34) V-spec II",
      "Subaru Impreza WRX STI '04",
      "Toyota MR2 GT-S (SW20) '97",
      "Toyota Supra RZ (JZA80) '97"
    ],
    "S (Supercar)": [
      "Aston Martin DB5 '64",
      "Aston Martin One-77 '11",
      "Bugatti Chiron '16",
      "Bugatti Veyron 16.4 '13",
      "Ferrari Enzo Ferrari '02",
      "Ferrari F40 '92",
      "Ferrari LaFerrari '13",
      "Jaguar XJ13 Race Car '66",
      "Lamborghini Countach LP400 '74",
      "Lamborghini Miura P400 Sv '71",
      "Lamborghini Veneno '14",
      "McLaren F1 '94",
      "McLaren Senna '18",
      "Mercedes-AMG GT R '17",
      "Mercedes-AMG Project ONE '22",
      "Pagani Huayra '13",
      "Porsche Carrera GT '04",
      "Porsche 918 Spyder '13"
    ],
    "Gr.X / Vision GT": [
      "Red Bull X2019 Competition",
      "Tomahawk X Vision Gran Turismo",
      "Toyota Gazoo FT-1 Vision Gran Turismo",
      "Daihatsu Copen RJ Vision GT",
      "Genesis X Gran Berlinetta VGT",
      "Lamborghini Lambo V12 Vision GT",
      "Mazda RX-Vision GT3 Concept",
      "Mercedes-AMG Vision GT"
    ]
  }
};

// ─────────────────────────────────────────────
// TRACK LISTS — full accurate lists per sim
// ─────────────────────────────────────────────
export const TRACK_LISTS = {
  "iRacing": [
    "Autodromo José Carlos Pace (Interlagos)",
    "Autodromo Nazionale Monza",
    "Brands Hatch GP",
    "Brands Hatch Indy",
    "Charlotte Motor Speedway Road Course",
    "Circuit de Catalunya GP",
    "Circuit de la Sarthe (Le Mans)",
    "Circuit of the Americas",
    "Circuit Zandvoort",
    "Daytona International Speedway Road Course",
    "Donington Park GP",
    "Donington Park National",
    "Fuji International Speedway",
    "Hungaroring",
    "Imola",
    "Indianapolis Motor Speedway Road Course",
    "Iowa Speedway",
    "Laguna Seca",
    "Lime Rock Park",
    "Mid-Ohio Sports Car Course",
    "Mount Panorama (Bathurst)",
    "Nürburgring GP",
    "Nürburgring Nordschleife",
    "Oulton Park Island",
    "Oulton Park International",
    "Phoenix Raceway",
    "Red Bull Ring GP",
    "Road America",
    "Road Atlanta",
    "Silverstone GP",
    "Silverstone National",
    "Snetterton 200",
    "Snetterton 300",
    "Spa-Francorchamps",
    "Suzuka Circuit GP",
    "Talladega Superspeedway",
    "Tsukuba Circuit",
    "Virginia International Raceway Full",
    "Watkins Glen International",
    "Watkins Glen Boot"
  ],
  "Assetto Corsa Competizione": [
    "Autodromo di Magione",
    "Autodromo Nazionale Monza",
    "Autodromo Vallelunga",
    "Brands Hatch GP",
    "Brands Hatch Indy",
    "Chang International Circuit (Buriram)",
    "Circuit de Catalunya",
    "Circuit Paul Ricard",
    "Circuit Ricardo Tormo (Valencia)",
    "Circuit Zandvoort",
    "Donington Park",
    "Hungaroring",
    "Imola",
    "Indianapolis Road Course",
    "Kyalami",
    "Laguna Seca",
    "Misano World Circuit Marco Simoncelli",
    "Mount Panorama (Bathurst)",
    "Nürburgring GP",
    "Oulton Park",
    "Red Bull Ring GP",
    "Silverstone GP",
    "Snetterton 300",
    "Spa-Francorchamps",
    "Suzuka Circuit",
    "Watkins Glen",
    "Zolder",
    "Circuit of the Americas (COTA)",
    "Fuji Speedway"
  ],
  "Assetto Corsa": [
    "Autodromo di Magione",
    "Autodromo di Modena",
    "Autodromo Nazionale Monza",
    "Brands Hatch",
    "Circuit de Catalunya",
    "Dragon Trail Seaside",
    "Dragon Trail Gardens",
    "Dubai Autodrome",
    "Imola",
    "Jerez de la Frontera",
    "Laguna Seca",
    "Mugello Circuit",
    "Nürburgring GP",
    "Nürburgring Nordschleife",
    "Road America",
    "Silverstone GP",
    "Silverstone International",
    "Spa-Francorchamps",
    "Trento-Bondone Hill Climb",
    "Vallelunga"
  ],
  "Assetto Corsa Evo": [
    "Autodromo di Modena",
    "Brands Hatch GP",
    "Circuit de Catalunya",
    "Imola",
    "Laguna Seca",
    "Misano World Circuit",
    "Mount Panorama (Bathurst)",
    "Mugello Circuit",
    "Nürburgring Nordschleife",
    "Red Bull Ring",
    "Silverstone GP",
    "Spa-Francorchamps",
    "Suzuka Circuit",
    "Monza"
  ],
  "Le Mans Ultimate": [
    "Circuit de la Sarthe (Le Mans 24h)",
    "Autodromo José Carlos Pace (Interlagos)",
    "Autodromo Nazionale Monza",
    "Bahrain International Circuit",
    "Circuit de Catalunya (Barcelona)",
    "Fuji Speedway",
    "Indianapolis Motor Speedway",
    "Lusail International Circuit (Qatar)",
    "Portimão",
    "Road Atlanta (Petit Le Mans)",
    "Sebring International Raceway",
    "Spa-Francorchamps"
  ],
  "Automobilista 2": [
    "Autodromo Ayrton Senna (Londrina)",
    "Autodromo de Cascavel",
    "Autodromo de Goiânia",
    "Autodromo de Potrero de los Funes",
    "Autodromo de Santa Cruz do Sul",
    "Autodromo de Tarumã",
    "Autodromo do Campo Grande",
    "Autodromo José Carlos Pace (Interlagos)",
    "Autodromo Lauro Chaves (Velopark)",
    "Circuit Gilles Villeneuve (Montreal)",
    "Curitiba Race Track",
    "Daytona Road Course",
    "Hockenheimring GP",
    "Hockenheimring Short",
    "Imola",
    "Jerez de la Frontera",
    "Kyalami",
    "Laguna Seca",
    "Long Beach Street Circuit",
    "Mount Panorama (Bathurst)",
    "Nürburgring GP",
    "Nürburgring Nordschleife",
    "Red Bull Ring GP",
    "Sebring International Raceway",
    "Silverstone GP",
    "Spa-Francorchamps",
    "Autodromo Internacional de Curitiba"
  ],
  "RaceRoom": [
    "Alemannenring",
    "Anderstorp Raceway – Grand Prix",
    "Anderstorp Raceway – South Circuit",
    "Autodrom Most – Grand Prix",
    "AVUS – 1992",
    "AVUS – 1937",
    "Bathurst Circuit – Mount Panorama",
    "Bilster Berg – Gesamtstrecke",
    "Bilster Berg – Ostschleife",
    "Bilster Berg – Westschleife",
    "Bilster Berg – Club",
    "Brands Hatch – Grand Prix",
    "Brands Hatch – Indy",
    "Brno Circuit – Grand Prix",
    "Chang International Circuit – Grand Prix",
    "Circuit de Charade – GP",
    "Circuit de Charade – Short",
    "Circuit de Pau-Ville",
    "Circuit Zandvoort – Modern GP",
    "Circuit Zandvoort – Historic GP",
    "Circuit Zolder",
    "Daytona International Speedway – Road Course",
    "Daytona International Speedway – Motorcycle Course",
    "Daytona International Speedway – Tri-Oval",
    "DEKRA Lausitzring – Grand Prix",
    "DEKRA Lausitzring – Short",
    "DEKRA Lausitzring – DTM",
    "DEKRA Lausitzring – Club",
    "DEKRA Lausitzring – Oval",
    "Donington Park – Grand Prix",
    "Donington Park – National",
    "Dubai Autodrome – Grand Prix",
    "Dubai Autodrome – International",
    "Dubai Autodrome – National",
    "EuroSpeedway Lausitz",
    "Fuji Speedway",
    "Hockenheimring – Grand Prix",
    "Hockenheimring – Short",
    "Hockenheimring – National",
    "Hockenheimring – Motodrom",
    "Hungaroring",
    "Imola",
    "Indianapolis Motor Speedway – Oval",
    "Indianapolis Motor Speedway – Road Course",
    "Jyllandsringen – Grand Prix",
    "Jyllandsringen – Touring",
    "Jyllandsringen – Club",
    "Lausitzring – Grand Prix",
    "Macau Circuit",
    "Motorsport Arena Oschersleben – Grand Prix",
    "Motorsport Arena Oschersleben – Short",
    "Motorsport Arena Oschersleben – Club",
    "Nürburgring – Grand Prix",
    "Nürburgring – Sprint",
    "Nürburgring Nordschleife",
    "Paul Ricard Circuit – Grand Prix",
    "Paul Ricard Circuit – Test Oval",
    "Paul Ricard Circuit – Mistral Short",
    "Paul Ricard Circuit – Mistral Long",
    "Paul Ricard Circuit – Club",
    "Red Bull Ring – Grand Prix",
    "Red Bull Ring – National",
    "Road America",
    "Sachsenring – Grand Prix",
    "Sachsenring – Short",
    "Salzburgring",
    "Sepang International Circuit – Grand Prix",
    "Silverstone – Grand Prix",
    "Silverstone – International",
    "Silverstone – National",
    "Sonoma Raceway – Grand Prix",
    "Sonoma Raceway – Short",
    "Spa-Francorchamps",
    "Suzuka Circuit – Grand Prix",
    "Suzuka Circuit – East",
    "TT Circuit Assen",
    "Watkins Glen International",
    "Watkins Glen International – Short",
    "Watkins Glen International – Boot",
    "Wachauring",
    "Zaandvoort – National",
    "Zhuhai International Circuit"
  ],
  "RaceRoom": RACEROOM_TRACKS,

  "Gran Turismo 7": [
    "Alsace Village",
    "Autopolis International Racing Course",
    "Autodromo de Catalunya (Barcelona)",
    "Autodromo José Carlos Pace (Interlagos)",
    "Blue Moon Bay Speedway",
    "Circuit de la Sarthe (Le Mans)",
    "Colorado Springs",
    "Daytona Road Course",
    "Deep Forest Raceway",
    "Dragon Trail Gardens",
    "Dragon Trail Seaside",
    "Grand Valley Speedway",
    "High Speed Ring",
    "Kyoto Driving Park Miyabi",
    "Kyoto Driving Park Yamagiwa",
    "Laguna Seca",
    "Nürburgring GP",
    "Nürburgring 24h",
    "Nürburgring Nordschleife",
    "Red Bull Ring GP",
    "Sardegna Road Track A",
    "Sardegna Road Track B",
    "Silverstone GP",
    "Silverstone National",
    "Spa-Francorchamps",
    "Special Stage Route 5",
    "Special Stage Route X",
    "Suzuka Circuit",
    "Suzuka Circuit East",
    "Tokyo Expressway Central Outer",
    "Tokyo Expressway North Outer",
    "Tokyo Expressway South Outer",
    "Tsukuba Circuit",
    "Watkins Glen International",
    "Willow Springs Raceway",
    "Autodrome Lago Maggiore GP",
    "Autodrome Lago Maggiore Centre",
    "Brands Hatch GP",
    "Brands Hatch Indy",
    "Circuit de Sainte-Croix A",
    "Circuit de Sainte-Croix B",
    "Circuit de Sainte-Croix C"
  ]
};

// ─────────────────────────────────────────────
// SETUP PARAMETERS (for Setup Guide)
// ─────────────────────────────────────────────
export const SETUP_PARAMETERS = [
  {
    category: "Tyres & Pressures",
    icon: "Circle",
    params: [
      {
        name: "Tyre Pressure",
        left: "Lower pressure",
        right: "Higher pressure",
        leftEffect: "More grip in corners, slower on straights, higher tyre wear",
        rightEffect: "Less grip, faster on straights, more responsive turn-in",
        tip: "Start at 26–28 PSI (GT3). Check after 3–4 laps — tyres need time to heat before readings mean anything. Too low = sloppy and overheating edges. Too high = slippery and nervous.",
        advanced: "Front-to-rear pressure split can tune balance. Slightly lower rear pressures add rear grip. In cold conditions (<10°C), increase starting pressures by 0.5–1.0 PSI to compensate for slower heat build."
      },
      {
        name: "Tyre Compound",
        left: "Softer compound",
        right: "Harder compound",
        leftEffect: "More peak grip, faster degradation, better in cold conditions",
        rightEffect: "Less peak grip, more durable, better in hot conditions",
        tip: "Softer = more grip but wears faster. Use soft for qualifying, medium or hard for longer races. Always switch to wet tyres when the track is damp — dry tyres on a wet track is a common beginner mistake.",
        advanced: "Track temperature heavily influences compound choice. Above 30°C consider going harder. Each heat cycle removes grip — tyres that have been heated and cooled repeatedly will never return to peak performance."
      }
    ]
  },
  {
    category: "Suspension Geometry",
    icon: "Settings2",
    params: [
      {
        name: "Camber (Front)",
        left: "Less negative camber",
        right: "More negative camber",
        leftEffect: "Better straight-line braking, less cornering grip",
        rightEffect: "Better cornering grip, uneven tyre wear, less braking grip",
        tip: "GT3 cars typically run -3.0° to -3.8°. If your inner tyre edge wears faster than the outer, you have too much. If the outer wears faster, add more. Aim for even wear across the tyre.",
        advanced: "More camber helps on fast sweeping tracks. On circuits like Monza with heavy braking, reduce camber for better traction. Camber loss under steering input is why high caster is valuable."
      },
      {
        name: "Camber (Rear)",
        left: "Less negative camber",
        right: "More negative camber",
        leftEffect: "More rear stability under braking",
        rightEffect: "Better rear grip in corners, potential instability",
        tip: "Run 1–2° less negative than the front (around -1.5° to -2.5°). Too much rear camber causes inner edge overheating and kills traction on exit.",
        advanced: "Rear camber affects traction on exit. Less camber = better traction in slow corners. Excess rear camber causes inner edge graining which progressively degrades rear grip."
      },
      {
        name: "Toe (Front)",
        left: "Toe out",
        right: "Toe in",
        leftEffect: "Sharper turn-in, less straight-line stability",
        rightEffect: "More stable on straights, slower turn-in response",
        tip: "Slight toe-out (-0.1 to -0.5mm) gives sharper turn-in. More toe-out = quicker reactions but more tyre wear. If your front tyres are overheating, excessive toe-out may be the cause.",
        advanced: "Toe-out on the front helps the car rotate into corners but increases wear rate. The scrub angle creates heat, which is why overheated front edges often point to excessive toe-out."
      },
      {
        name: "Toe (Rear)",
        left: "Toe out",
        right: "Toe in",
        leftEffect: "Rear feels loose, better rotation",
        rightEffect: "Rear feels planted, more stable",
        tip: "Always keep rear toe pointing inward (0.5–2.0mm). This keeps the car stable at speed. Rear toe-out will make the car snap sideways — avoid it entirely.",
        advanced: "Rear toe-in creates passive stability by opposing yaw rotation. More toe-in adds drag (slightly hurts top speed) but significantly improves high-speed stability and transitional behavior."
      },
      {
        name: "Caster",
        left: "Less caster",
        right: "More caster",
        leftEffect: "Lighter steering, less feedback",
        rightEffect: "Heavier steering, more dynamic camber gain in corners",
        tip: "More caster means the wheel leans into the corner as you steer — giving free extra grip. Most competitive setups run high caster (10°+). It makes steering heavier but more planted.",
        advanced: "Caster creates self-centering force and dynamic camber gain. As the wheel turns, the geometry creates additional negative camber on the outside wheel — essentially 'free' cornering grip without the straight-line penalties of static camber."
      }
    ]
  },
  {
    category: "Springs & Dampers",
    icon: "ArrowUpDown",
    params: [
      {
        name: "Spring Rate (Front)",
        left: "Softer springs",
        right: "Stiffer springs",
        leftEffect: "More mechanical grip, more body roll, slower response",
        rightEffect: "Less body roll, faster response, less forgiving over bumps",
        tip: "Stiffer = crisper response but less comfortable over bumps. Softer = more grip on rough tracks but more body roll. Start from the default and make small changes — one step at a time.",
        advanced: "The front-to-rear spring ratio determines the natural pitch behavior. A stiffer front ratio creates understeer. For high-downforce cars, springs must be stiff enough that aero loads don't compress the suspension excessively."
      },
      {
        name: "Spring Rate (Rear)",
        left: "Softer springs",
        right: "Stiffer springs",
        leftEffect: "More rear grip, more squat under acceleration",
        rightEffect: "Less rear grip, better rotation, more responsive",
        tip: "Soft rear springs help the car hook up on corner exit. Stiffer rear springs help the car rotate and change direction quicker. If you're sliding on exit, try going softer first.",
        advanced: "On high-downforce platforms, rear spring rate also controls how much the rear squats under aero load at speed. Too soft and the car's ride height changes dramatically between low and high speed, shifting the aero balance."
      },
      {
        name: "Bump Damping (Compression)",
        left: "Softer bump",
        right: "Stiffer bump",
        leftEffect: "Wheel absorbs bumps faster, more compliant over kerbs",
        rightEffect: "Wheel resists compression, more stable over crests",
        tip: "Controls how fast the suspension squashes down. Go softer if the car bounces over kerbs or feels harsh. Go stiffer if the car dives too much under braking or feels loose over crests.",
        advanced: "Most dampers have separate high-speed and low-speed bump settings. Low-speed bump controls body motion in corners and under braking. High-speed bump controls the response to sharp inputs like kerbs — they behave independently."
      },
      {
        name: "Rebound Damping",
        left: "Softer rebound",
        right: "Stiffer rebound",
        leftEffect: "Suspension extends faster, quicker weight transfer",
        rightEffect: "Suspension extends slower, more controlled, can cause hydraulic jacking",
        tip: "Controls how fast the suspension bounces back after a bump. Too stiff and the car feels planted but harsh over repeated bumps. Start at mid-range — it's not usually the first adjustment to make.",
        advanced: "Hydraulic jacking occurs when rebound is so stiff the suspension can't return before the next bump. A rebound-to-bump ratio of roughly 1.5–2:1 is a common starting point. Stiffer rear rebound helps prevent squat under acceleration."
      }
    ]
  },
  {
    category: "Anti-Roll Bars",
    icon: "Minus",
    params: [
      {
        name: "Front Anti-Roll Bar",
        left: "Softer",
        right: "Stiffer",
        leftEffect: "More front grip, less responsive turn-in",
        rightEffect: "Sharper turn-in, potential mid-corner understeer",
        tip: "This is your main tool for turn-in sharpness. Stiffer = snappier response but can cause understeer mid-corner. If the car pushes (understeers) in the middle of corners, soften the front ARB first.",
        advanced: "ARBs only work in corners — they transfer load from the compressed (outside) wheel to the extended (inside) wheel. The front-to-rear ARB ratio matters more than absolute values. A stiffer front ARB relative to the rear creates understeer."
      },
      {
        name: "Rear Anti-Roll Bar",
        left: "Softer",
        right: "Stiffer",
        leftEffect: "More rear stability, less rotation",
        rightEffect: "More rear rotation, potential oversteer on exit",
        tip: "Softening the rear ARB is usually the first fix for oversteer. It lets the rear wheels work more independently, increasing rear grip. Start here before changing springs.",
        advanced: "A soft rear ARB allows each rear wheel to work more independently — essential for smooth kerb absorption. On rear-engine cars (Porsche), the rear ARB is particularly sensitive due to the weight over the rear axle."
      }
    ]
  },
  {
    category: "Aerodynamics",
    icon: "Wind",
    params: [
      {
        name: "Ride Height (Front)",
        left: "Higher front",
        right: "Lower front",
        leftEffect: "Less front downforce, more stable at speed, less kerb risk",
        rightEffect: "More front downforce, sharper turn-in, risk of bottoming out",
        tip: "Lower front = more front downforce, sharper turn-in — but too low and you'll bottom out on bumps. Start with the default and go 1–2mm lower at smooth tracks. Keep it higher at bumpy circuits.",
        advanced: "Rake angle (front lower than rear) increases rear diffuser efficiency. The optimal rake varies by car but is usually 3–8mm difference. More rake shifts the aero balance rearward. Lowering the front also reduces the centre of gravity."
      },
      {
        name: "Rear Wing Angle",
        left: "Less wing",
        right: "More wing",
        leftEffect: "Higher top speed, less rear grip in corners",
        rightEffect: "Lower top speed, much more rear grip at high speed",
        tip: "More wing = more grip but lower top speed. Less wing = faster straights but slippery in fast corners. Long straight tracks like Monza need low wing. Fast, flowing tracks like Spa or Bathurst need more.",
        advanced: "Wing efficiency (L/D ratio) varies with ride height. Some cars have a 'sweet spot' where small changes create disproportionate downforce gains. Stall speed — where the wing loses efficiency — is a real concern in accurate aero models."
      },
      {
        name: "Aero Balance (F/R Split)",
        left: "More front aero",
        right: "More rear aero",
        leftEffect: "Turn-in improves, high-speed understeer reduces",
        rightEffect: "Rear stability improves, high-speed oversteer reduces",
        tip: "Use this to shift grip balance front-to-rear without changing total downforce. Oversteer in fast corners? Add more rear wing. Understeer through fast bends? Add more front splitter.",
        advanced: "Aero balance shifts with speed — a setup neutral at 150 km/h may develop understeer at 250 km/h if the rear wing produces more efficient downforce at speed. Test your setup at the speed of your key corners."
      }
    ]
  },
  {
    category: "Differential",
    icon: "Cog",
    params: [
      {
        name: "Preload",
        left: "Lower preload",
        right: "Higher preload",
        leftEffect: "Freer differential, easier rotation, less stable under power",
        rightEffect: "More locked feel, more stability under power, harder to rotate",
        tip: "Think of preload as the baseline stiffness of the diff. Higher = more stable and consistent, but harder to rotate in tight hairpins. Start around 50–70Nm for GT3 cars.",
        advanced: "Preload mainly affects the transition zone — when you lift off entering a corner or just before applying power on exit. High preload smooths out lift-off snap oversteer but can make slow hairpin rotation difficult."
      },
      {
        name: "Power (Accel) Lock",
        left: "Less lock",
        right: "More lock",
        leftEffect: "Less traction, easier rotation on power, potential inside wheelspin",
        rightEffect: "More traction, more stability on exit, harder to rotate",
        tip: "Controls traction on corner exit. More lock = both rear wheels work together = better traction, but the car can push wide. Less lock = easier rotation. 60–75% is a typical GT3 starting point.",
        advanced: "On rear-engine cars (Porsche 911), you can run higher power lock because the rear weight already provides good traction. Mid and front-engine cars often need lower power lock to avoid push on exit."
      },
      {
        name: "Coast (Decel) Lock",
        left: "Less lock",
        right: "More lock",
        leftEffect: "Car rotates more on entry, less engine braking stability",
        rightEffect: "More stable on turn-in, less rotation under braking",
        tip: "Affects the car on the way into a corner when you lift off. Lower = the car rotates more naturally. Higher = more stable but can cause the nose to push. Start at 30–45%.",
        advanced: "Trail-braking technique is heavily affected by coast lock. Aggressive trail-brakers often prefer lower coast lock for the additional rotation when the brake is partially applied into the corner apex."
      }
    ]
  },
  {
    category: "Brakes",
    icon: "Disc",
    params: [
      {
        name: "Brake Bias",
        left: "More rearward",
        right: "More forward",
        leftEffect: "Rear brakes do more work, potential rear lockup and rotation",
        rightEffect: "Front brakes do more work, more stable braking, potential front lockup",
        tip: "55–60% front is the safe starting point for GT3. If fronts are locking, move it slightly rearward. If the rear snaps sideways under braking, move it more forward. Change by 0.5–1% at a time.",
        advanced: "Brake bias interacts with ABS settings. With strong ABS, you can run more rearward bias. As tyres wear, the optimal bias shifts — worn rear tyres need more forward bias to avoid rear lockup."
      },
      {
        name: "Brake Duct / Cooling",
        left: "Less cooling",
        right: "More cooling",
        leftEffect: "Less drag, higher brake temperatures, potential fade",
        rightEffect: "More drag, lower brake temps, consistent braking",
        tip: "More cooling = consistent brakes all race, but slightly more drag. Less cooling = tiny speed boost but brakes can fade. Open them at tracks with many heavy braking zones. Close them at fast tracks like Monza.",
        advanced: "Monitor brake temps during practice. If they exceed 600°C regularly, open the ducts. Brakes operating too cold (below 200°C) also lose effectiveness — closing ducts slightly in cold, wet conditions can help."
      }
    ]
  },
  {
    category: "Electronics",
    icon: "Zap",
    params: [
      {
        name: "Traction Control (TC)",
        left: "Less TC",
        right: "More TC",
        leftEffect: "More wheelspin allowed, faster but requires precision",
        rightEffect: "Limits wheelspin aggressively, slower but safer",
        tip: "Higher TC = the electronics manage wheelspin for you — easier but slightly slower. Start at 5–7 in ACC, 3–4 in iRacing. Reduce gradually as you gain confidence. Always turn it up in wet conditions.",
        advanced: "TC cut vs TC slip — some sims let you adjust both. Cut reduces engine power on wheelspin detection. Slip manages the speed differential between drive wheels. In dry, lower TC2 (slip) while keeping TC1 (cut) moderate."
      },
      {
        name: "ABS",
        left: "Less ABS",
        right: "More ABS",
        leftEffect: "Shorter braking distances, easier to lock wheels",
        rightEffect: "Harder to lock up, longer braking distances possible",
        tip: "Higher ABS = harder to lock wheels — safer for beginners. Lower = shorter braking distances but requires precise pedal control. Beginners: start at 5–6. Reduce it gradually as your braking improves. Always increase in the wet.",
        advanced: "ABS directly affects trail-braking capability. Less ABS = more pedal feel and ability to modulate, but requires precise inputs. Reduce ABS by 1 as you become more confident with braking technique."
      },
      {
        name: "Engine Map",
        left: "Lower power / economy",
        right: "Full power",
        leftEffect: "Better fuel consumption, smoother delivery, less wear",
        rightEffect: "Maximum performance, higher fuel usage",
        tip: "Use the highest map in qualifying. In a race, dropping one map lower can save enough fuel to skip an extra pit stop. Only use the lowest maps as a last resort — it costs noticeable pace.",
        advanced: "In endurance races, fuel mapping can save 10–15% fuel which translates to fewer pit stops. Some cars have maps specifically for wet conditions that reduce torque spikes on corner exit."
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SIM-SPECIFIC SETUP PARAMETERS
// All parameters cross-referenced against each title's actual in-game UI.
// ─────────────────────────────────────────────────────────────────────────────

export const SIM_SETUP_PARAMS = {

  // ── ASSETTO CORSA COMPETIZIONE ────────────────────────────────────────────
  // ACC uses a 0–10 (or 0–11) integer scale for ARBs, dampers, electronics.
  // Springs in N/mm. Camber in degrees (negative). Toe in mm. Brake bias % front.
  // Tyre pressure in PSI (cold). Fuel in litres. Brake pad 1–4 (1=aggressive, 4=endurance).
  // TC1 = TC cut (power reduction), TC2 = TC slip (wheel-speed diff). ABS 0–11. Engine map 1–10.
  "Assetto Corsa Competizione": [
    {
      group: "Tyres",
      params: [
        { key: "tyre_pressure_fl", label: "Pressure FL", unit: " PSI", min: 20.0, max: 35.0, step: 0.1, default: 27.3 },
        { key: "tyre_pressure_fr", label: "Pressure FR", unit: " PSI", min: 20.0, max: 35.0, step: 0.1, default: 27.3 },
        { key: "tyre_pressure_rl", label: "Pressure RL", unit: " PSI", min: 20.0, max: 35.0, step: 0.1, default: 26.8 },
        { key: "tyre_pressure_rr", label: "Pressure RR", unit: " PSI", min: 20.0, max: 35.0, step: 0.1, default: 26.8 }
      ]
    },
    {
      group: "Aerodynamics",
      params: [
        { key: "front_splitter", label: "Front Splitter", unit: "", min: 0, max: 3, step: 1, default: 1 },
        { key: "rear_wing", label: "Rear Wing", unit: "", min: 0, max: 10, step: 1, default: 6 },
        { key: "ride_height_front", label: "Ride Height F", unit: " mm", min: 50, max: 90, step: 1, default: 58 },
        { key: "ride_height_rear", label: "Ride Height R", unit: " mm", min: 55, max: 100, step: 1, default: 62 }
      ]
    },
    {
      group: "Alignment",
      params: [
        { key: "camber_front", label: "Camber F", unit: "°", min: -5.0, max: -0.5, step: 0.1, default: -3.5 },
        { key: "camber_rear", label: "Camber R", unit: "°", min: -4.0, max: -0.5, step: 0.1, default: -2.5 },
        { key: "toe_front", label: "Toe F", unit: " mm", min: -2.0, max: 2.0, step: 0.1, default: -0.3 },
        { key: "toe_rear", label: "Toe R", unit: " mm", min: -2.0, max: 2.0, step: 0.1, default: 0.8 },
        { key: "caster", label: "Caster", unit: "°", min: 8.0, max: 17.0, step: 0.1, default: 12.5 }
      ]
    },
    {
      group: "Mechanical Grip",
      params: [
        { key: "arb_front", label: "ARB F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "arb_rear", label: "ARB R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "spring_front", label: "Spring Rate F", unit: " N/mm", min: 50, max: 200, step: 5, default: 90 },
        { key: "spring_rear", label: "Spring Rate R", unit: " N/mm", min: 50, max: 200, step: 5, default: 100 },
        { key: "bump_front", label: "Bump F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "bump_rear", label: "Bump R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "rebound_front", label: "Rebound F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "rebound_rear", label: "Rebound R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 }
      ]
    },
    {
      group: "Differential",
      params: [
        { key: "diff_preload", label: "Preload", unit: " Nm", min: 20, max: 200, step: 5, default: 60 },
        { key: "diff_power", label: "Power Lock", unit: "%", min: 0, max: 100, step: 5, default: 60 },
        { key: "diff_coast", label: "Coast Lock", unit: "%", min: 0, max: 100, step: 5, default: 40 }
      ]
    },
    {
      group: "Brakes",
      params: [
        { key: "brake_bias", label: "Brake Bias (F)", unit: "%", min: 50.0, max: 70.0, step: 0.2, default: 57.5 },
        { key: "brake_duct_front", label: "Brake Duct F (0–6)", unit: "", min: 0, max: 6, step: 1, default: 2 },
        { key: "brake_duct_rear", label: "Brake Duct R (0–6)", unit: "", min: 0, max: 6, step: 1, default: 1 },
        { key: "brake_pad", label: "Brake Pad (1=Race 2=Performance 3=Medium 4=Endurance)", unit: "", min: 1, max: 4, step: 1, default: 2 }
      ]
    },
    {
      group: "Electronics",
      params: [
        { key: "tc1", label: "TC1 – Cut (0–11)", unit: "", min: 0, max: 11, step: 1, default: 4 },
        { key: "tc2", label: "TC2 – Slip (0–11)", unit: "", min: 0, max: 11, step: 1, default: 3 },
        { key: "abs", label: "ABS (0–11)", unit: "", min: 0, max: 11, step: 1, default: 3 },
        { key: "engine_map", label: "Engine Map (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 }
      ]
    },
    {
      group: "Strategy",
      params: [
        { key: "fuel_load", label: "Fuel Load", unit: " L", min: 1, max: 120, step: 1, default: 60 },
        { key: "tyre_compound", label: "Tyre Compound (1=Dry / 2=Wet)", unit: "", min: 1, max: 2, step: 1, default: 1 },
        { key: "tyre_blankets", label: "Tyre Blankets (0=Off / 1=On)", unit: "", min: 0, max: 1, step: 1, default: 1 }
      ]
    }
  ],

  // ── IRACING ───────────────────────────────────────────────────────────────
  // iRacing uses metric or imperial depending on series. GT3/GTE/GTP use metric
  // (mm, N/mm, kg). Open-wheel and NASCAR configs vary but we use metric as a
  // universal reference in this form. Springs in lbs/in for GT3; we normalise to
  // N/mm-equivalent labels noting the in-game unit. Toe in degrees. ARB 1–9 steps.
  // Electronics TC 0–9, ABS 0–9, Engine Map 1–6. Fuel in kg (iRacing native).
  "iRacing": [
    {
      group: "Tyres",
      params: [
        { key: "tyre_pressure_fl", label: "Pressure FL", unit: " PSI", min: 20.0, max: 40.0, step: 0.5, default: 28.0 },
        { key: "tyre_pressure_fr", label: "Pressure FR", unit: " PSI", min: 20.0, max: 40.0, step: 0.5, default: 28.0 },
        { key: "tyre_pressure_rl", label: "Pressure RL", unit: " PSI", min: 20.0, max: 40.0, step: 0.5, default: 27.5 },
        { key: "tyre_pressure_rr", label: "Pressure RR", unit: " PSI", min: 20.0, max: 40.0, step: 0.5, default: 27.5 }
      ]
    },
    {
      group: "Aerodynamics",
      params: [
        { key: "front_downforce", label: "Front Downforce (1–12)", unit: "", min: 1, max: 12, step: 1, default: 6 },
        { key: "rear_downforce", label: "Rear Downforce (1–12)", unit: "", min: 1, max: 12, step: 1, default: 7 },
        { key: "ride_height_front", label: "Ride Height F", unit: " mm", min: 40, max: 130, step: 1, default: 60 },
        { key: "ride_height_rear", label: "Ride Height R", unit: " mm", min: 40, max: 130, step: 1, default: 75 }
      ]
    },
    {
      group: "Alignment",
      params: [
        { key: "camber_front", label: "Camber F", unit: "°", min: -5.0, max: 0.0, step: 0.1, default: -3.2 },
        { key: "camber_rear", label: "Camber R", unit: "°", min: -4.0, max: 0.0, step: 0.1, default: -2.0 },
        { key: "toe_front", label: "Toe F", unit: "°", min: -0.5, max: 0.5, step: 0.01, default: -0.10 },
        { key: "toe_rear", label: "Toe R", unit: "°", min: -0.5, max: 0.5, step: 0.01, default: 0.10 },
        { key: "caster", label: "Caster", unit: "°", min: 4.0, max: 18.0, step: 0.5, default: 11.0 }
      ]
    },
    {
      group: "Springs & Bars",
      params: [
        { key: "spring_front", label: "Spring F", unit: " lbs/in", min: 200, max: 1200, step: 50, default: 550 },
        { key: "spring_rear", label: "Spring R", unit: " lbs/in", min: 200, max: 1200, step: 50, default: 600 },
        { key: "arb_front", label: "ARB F (1–9)", unit: "", min: 1, max: 9, step: 1, default: 4 },
        { key: "arb_rear", label: "ARB R (1–9)", unit: "", min: 1, max: 9, step: 1, default: 3 },
        { key: "bump_front", label: "Bump F (1–16)", unit: "", min: 1, max: 16, step: 1, default: 8 },
        { key: "bump_rear", label: "Bump R (1–16)", unit: "", min: 1, max: 16, step: 1, default: 8 },
        { key: "rebound_front", label: "Rebound F (1–16)", unit: "", min: 1, max: 16, step: 1, default: 8 },
        { key: "rebound_rear", label: "Rebound R (1–16)", unit: "", min: 1, max: 16, step: 1, default: 8 }
      ]
    },
    {
      group: "Differential",
      params: [
        { key: "diff_preload", label: "Preload", unit: " Nm", min: 0, max: 150, step: 10, default: 50 },
        { key: "diff_power", label: "Power Lock", unit: "%", min: 0, max: 100, step: 5, default: 65 },
        { key: "diff_coast", label: "Coast Lock", unit: "%", min: 0, max: 100, step: 5, default: 35 }
      ]
    },
    {
      group: "Brakes",
      params: [
        { key: "brake_bias", label: "Brake Bias (F)", unit: "%", min: 48.0, max: 68.0, step: 0.5, default: 57.0 },
        { key: "brake_force", label: "Brake Force", unit: "%", min: 80, max: 100, step: 1, default: 100 }
      ]
    },
    {
      group: "Electronics",
      params: [
        { key: "tc", label: "Traction Control (0–9)", unit: "", min: 0, max: 9, step: 1, default: 3 },
        { key: "abs", label: "ABS (0–9)", unit: "", min: 0, max: 9, step: 1, default: 3 },
        { key: "engine_map", label: "Engine Map (1–6)", unit: "", min: 1, max: 6, step: 1, default: 1 }
      ]
    },
    {
      group: "Strategy",
      params: [
        { key: "fuel_load", label: "Fuel Load", unit: " kg", min: 1, max: 120, step: 1, default: 60 },
        { key: "ballast", label: "Ballast", unit: " kg", min: 0, max: 50, step: 1, default: 0 },
        { key: "tyre_compound", label: "Tyre Compound (1=Soft 2=Medium 3=Hard 4=Wet)", unit: "", min: 1, max: 4, step: 1, default: 2 }
      ]
    }
  ],

  // ── ASSETTO CORSA (original) ──────────────────────────────────────────────
  // AC uses integer sliders for ARBs and dampers (unitless 1–10 in most cars,
  // or raw Ns/mm for high-end physics cars).  Springs in N/mm. Camber in degrees.
  // Toe in degrees (not mm — AC uses angular toe, unlike ACC).
  // Electronics: TC 0–10, ABS 0–10. No engine map. Fuel in litres.
  // Tyre compounds: 1=Street / 2=Sport / 3=Semi-Slick / 4=Slick (varies by car).
  "Assetto Corsa": [
    {
      group: "Tyres",
      params: [
        { key: "tyre_pressure_fl", label: "Pressure FL", unit: " PSI", min: 18.0, max: 38.0, step: 0.5, default: 27.3 },
        { key: "tyre_pressure_fr", label: "Pressure FR", unit: " PSI", min: 18.0, max: 38.0, step: 0.5, default: 27.3 },
        { key: "tyre_pressure_rl", label: "Pressure RL", unit: " PSI", min: 18.0, max: 38.0, step: 0.5, default: 26.8 },
        { key: "tyre_pressure_rr", label: "Pressure RR", unit: " PSI", min: 18.0, max: 38.0, step: 0.5, default: 26.8 }
      ]
    },
    {
      group: "Aerodynamics",
      params: [
        { key: "front_wing", label: "Front Wing (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "rear_wing", label: "Rear Wing (1–10)", unit: "", min: 1, max: 10, step: 1, default: 6 },
        { key: "ride_height_front", label: "Ride Height F", unit: " mm", min: 50, max: 100, step: 1, default: 58 },
        { key: "ride_height_rear", label: "Ride Height R", unit: " mm", min: 55, max: 110, step: 1, default: 62 }
      ]
    },
    {
      group: "Alignment",
      params: [
        { key: "camber_front", label: "Camber F", unit: "°", min: -5.0, max: -0.5, step: 0.1, default: -3.4 },
        { key: "camber_rear", label: "Camber R", unit: "°", min: -4.0, max: -0.5, step: 0.1, default: -2.4 },
        { key: "toe_front", label: "Toe F", unit: "°", min: -0.5, max: 0.5, step: 0.01, default: -0.06 },
        { key: "toe_rear", label: "Toe R", unit: "°", min: -0.5, max: 0.5, step: 0.01, default: 0.15 },
        { key: "caster", label: "Caster", unit: "°", min: 7.0, max: 17.0, step: 0.1, default: 12.0 }
      ]
    },
    {
      group: "Mechanical Grip",
      params: [
        { key: "arb_front", label: "ARB F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "arb_rear", label: "ARB R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "spring_front", label: "Spring Rate F", unit: " N/mm", min: 40, max: 200, step: 5, default: 85 },
        { key: "spring_rear", label: "Spring Rate R", unit: " N/mm", min: 40, max: 200, step: 5, default: 95 },
        { key: "bump_front", label: "Bump F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "bump_rear", label: "Bump R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "rebound_front", label: "Rebound F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 6 },
        { key: "rebound_rear", label: "Rebound R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 6 }
      ]
    },
    {
      group: "Differential",
      params: [
        { key: "diff_preload", label: "Preload", unit: " Nm", min: 0, max: 200, step: 10, default: 50 },
        { key: "diff_power", label: "Power Lock", unit: "%", min: 0, max: 100, step: 5, default: 60 },
        { key: "diff_coast", label: "Coast Lock", unit: "%", min: 0, max: 100, step: 5, default: 35 }
      ]
    },
    {
      group: "Brakes",
      params: [
        { key: "brake_bias", label: "Brake Bias (F)", unit: "%", min: 48.0, max: 70.0, step: 0.5, default: 57.0 },
        { key: "brake_duct", label: "Brake Duct (0–6)", unit: "", min: 0, max: 6, step: 1, default: 2 }
      ]
    },
    {
      group: "Electronics",
      params: [
        { key: "tc", label: "Traction Control (0–10)", unit: "", min: 0, max: 10, step: 1, default: 4 },
        { key: "abs", label: "ABS (0–10)", unit: "", min: 0, max: 10, step: 1, default: 3 }
      ]
    },
    {
      group: "Strategy",
      params: [
        { key: "fuel_load", label: "Fuel Load", unit: " L", min: 1, max: 120, step: 1, default: 60 },
        { key: "tyre_compound", label: "Tyre Compound (1=Street 2=Sport 3=Semi-Slick 4=Slick)", unit: "", min: 1, max: 4, step: 1, default: 3 }
      ]
    }
  ],

  // ── ASSETTO CORSA EVO ─────────────────────────────────────────────────────
  // ACE closely mirrors ACC's setup UI (Early Access 2025). Integer ARB/damper
  // scales 1–10, springs N/mm, camber °, toe mm, brake bias % front.
  // Electronics: TC1, TC2, ABS 0–11, Engine Map 1–10. Fuel L. Compounds: Dry/Wet.
  "Assetto Corsa Evo": [
    {
      group: "Tyres",
      params: [
        { key: "tyre_pressure_fl", label: "Pressure FL", unit: " PSI", min: 20.0, max: 35.0, step: 0.1, default: 27.3 },
        { key: "tyre_pressure_fr", label: "Pressure FR", unit: " PSI", min: 20.0, max: 35.0, step: 0.1, default: 27.3 },
        { key: "tyre_pressure_rl", label: "Pressure RL", unit: " PSI", min: 20.0, max: 35.0, step: 0.1, default: 26.8 },
        { key: "tyre_pressure_rr", label: "Pressure RR", unit: " PSI", min: 20.0, max: 35.0, step: 0.1, default: 26.8 }
      ]
    },
    {
      group: "Aerodynamics",
      params: [
        { key: "front_splitter", label: "Front Splitter (0–3)", unit: "", min: 0, max: 3, step: 1, default: 1 },
        { key: "rear_wing", label: "Rear Wing (0–10)", unit: "", min: 0, max: 10, step: 1, default: 6 },
        { key: "ride_height_front", label: "Ride Height F", unit: " mm", min: 50, max: 90, step: 1, default: 58 },
        { key: "ride_height_rear", label: "Ride Height R", unit: " mm", min: 55, max: 100, step: 1, default: 62 }
      ]
    },
    {
      group: "Alignment",
      params: [
        { key: "camber_front", label: "Camber F", unit: "°", min: -5.0, max: -0.5, step: 0.1, default: -3.5 },
        { key: "camber_rear", label: "Camber R", unit: "°", min: -4.0, max: -0.5, step: 0.1, default: -2.5 },
        { key: "toe_front", label: "Toe F", unit: " mm", min: -2.0, max: 2.0, step: 0.1, default: -0.3 },
        { key: "toe_rear", label: "Toe R", unit: " mm", min: -2.0, max: 2.0, step: 0.1, default: 0.8 },
        { key: "caster", label: "Caster", unit: "°", min: 8.0, max: 17.0, step: 0.1, default: 12.5 }
      ]
    },
    {
      group: "Mechanical Grip",
      params: [
        { key: "arb_front", label: "ARB F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "arb_rear", label: "ARB R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "spring_front", label: "Spring Rate F", unit: " N/mm", min: 50, max: 200, step: 5, default: 90 },
        { key: "spring_rear", label: "Spring Rate R", unit: " N/mm", min: 50, max: 200, step: 5, default: 100 },
        { key: "bump_front", label: "Bump F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "bump_rear", label: "Bump R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "rebound_front", label: "Rebound F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "rebound_rear", label: "Rebound R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 }
      ]
    },
    {
      group: "Differential",
      params: [
        { key: "diff_preload", label: "Preload", unit: " Nm", min: 20, max: 200, step: 5, default: 60 },
        { key: "diff_power", label: "Power Lock", unit: "%", min: 0, max: 100, step: 5, default: 60 },
        { key: "diff_coast", label: "Coast Lock", unit: "%", min: 0, max: 100, step: 5, default: 40 }
      ]
    },
    {
      group: "Brakes",
      params: [
        { key: "brake_bias", label: "Brake Bias (F)", unit: "%", min: 50.0, max: 70.0, step: 0.2, default: 57.5 },
        { key: "brake_duct_front", label: "Brake Duct F (0–6)", unit: "", min: 0, max: 6, step: 1, default: 2 },
        { key: "brake_duct_rear", label: "Brake Duct R (0–6)", unit: "", min: 0, max: 6, step: 1, default: 1 },
        { key: "brake_pad", label: "Brake Pad (1=Race 2=Performance 3=Medium 4=Endurance)", unit: "", min: 1, max: 4, step: 1, default: 2 }
      ]
    },
    {
      group: "Electronics",
      params: [
        { key: "tc1", label: "TC1 – Cut (0–11)", unit: "", min: 0, max: 11, step: 1, default: 4 },
        { key: "tc2", label: "TC2 – Slip (0–11)", unit: "", min: 0, max: 11, step: 1, default: 3 },
        { key: "abs", label: "ABS (0–11)", unit: "", min: 0, max: 11, step: 1, default: 3 },
        { key: "engine_map", label: "Engine Map (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 }
      ]
    },
    {
      group: "Strategy",
      params: [
        { key: "fuel_load", label: "Fuel Load", unit: " L", min: 1, max: 120, step: 1, default: 60 },
        { key: "tyre_compound", label: "Tyre Compound (1=Dry / 2=Wet)", unit: "", min: 1, max: 2, step: 1, default: 1 },
        { key: "tyre_blankets", label: "Tyre Blankets (0=Off / 1=On)", unit: "", min: 0, max: 1, step: 1, default: 1 }
      ]
    }
  ],

  // ── LE MANS ULTIMATE ──────────────────────────────────────────────────────
  // LMU is based on rFactor 2 / Studio 397 engine. Pressures in kPa (cold).
  // Wing angles in degrees (Hypercar). Springs in N/mm. ARB in N/mm (continuous).
  // Dampers in Ns/mm (actual physics values, not integer steps).
  // Toe in mm. Camber in degrees. Caster in degrees.
  // Electronics: TC 0–10, ABS 0–10, Engine Map 1–6.
  // Compounds: 1=Soft 2=Medium 3=Hard 4=Wet (Hypercar/GT3). Fuel in litres.
  "Le Mans Ultimate": [
    {
      group: "Tyres",
      params: [
        { key: "tyre_pressure_fl", label: "Pressure FL", unit: " kPa", min: 140, max: 250, step: 1, default: 190 },
        { key: "tyre_pressure_fr", label: "Pressure FR", unit: " kPa", min: 140, max: 250, step: 1, default: 190 },
        { key: "tyre_pressure_rl", label: "Pressure RL", unit: " kPa", min: 140, max: 250, step: 1, default: 185 },
        { key: "tyre_pressure_rr", label: "Pressure RR", unit: " kPa", min: 140, max: 250, step: 1, default: 185 }
      ]
    },
    {
      group: "Aerodynamics",
      params: [
        { key: "front_wing", label: "Front Wing Angle", unit: "°", min: 0, max: 30, step: 0.5, default: 8.0 },
        { key: "rear_wing", label: "Rear Wing Angle", unit: "°", min: 0, max: 30, step: 0.5, default: 10.0 },
        { key: "ride_height_front", label: "Ride Height F", unit: " mm", min: 30, max: 100, step: 1, default: 50 },
        { key: "ride_height_rear", label: "Ride Height R", unit: " mm", min: 35, max: 110, step: 1, default: 65 }
      ]
    },
    {
      group: "Alignment",
      params: [
        { key: "camber_front", label: "Camber F", unit: "°", min: -5.0, max: 0.0, step: 0.1, default: -3.0 },
        { key: "camber_rear", label: "Camber R", unit: "°", min: -4.0, max: 0.0, step: 0.1, default: -2.0 },
        { key: "toe_front", label: "Toe F", unit: " mm", min: -3.0, max: 3.0, step: 0.1, default: -0.4 },
        { key: "toe_rear", label: "Toe R", unit: " mm", min: -3.0, max: 3.0, step: 0.1, default: 0.6 },
        { key: "caster", label: "Caster", unit: "°", min: 6.0, max: 16.0, step: 0.5, default: 10.5 }
      ]
    },
    {
      group: "Springs & Dampers",
      params: [
        { key: "spring_front", label: "Spring F", unit: " N/mm", min: 40, max: 350, step: 5, default: 110 },
        { key: "spring_rear", label: "Spring R", unit: " N/mm", min: 40, max: 350, step: 5, default: 130 },
        { key: "arb_front", label: "ARB F", unit: " N/mm", min: 0, max: 80, step: 5, default: 25 },
        { key: "arb_rear", label: "ARB R", unit: " N/mm", min: 0, max: 80, step: 5, default: 20 },
        { key: "bump_front", label: "Bump F", unit: " Ns/mm", min: 1000, max: 12000, step: 500, default: 4000 },
        { key: "bump_rear", label: "Bump R", unit: " Ns/mm", min: 1000, max: 12000, step: 500, default: 4500 },
        { key: "rebound_front", label: "Rebound F", unit: " Ns/mm", min: 1000, max: 12000, step: 500, default: 5500 },
        { key: "rebound_rear", label: "Rebound R", unit: " Ns/mm", min: 1000, max: 12000, step: 500, default: 6000 }
      ]
    },
    {
      group: "Differential",
      params: [
        { key: "diff_preload", label: "Preload", unit: " Nm", min: 0, max: 200, step: 10, default: 60 },
        { key: "diff_power", label: "Power Lock", unit: "%", min: 0, max: 100, step: 5, default: 65 },
        { key: "diff_coast", label: "Coast Lock", unit: "%", min: 0, max: 100, step: 5, default: 40 }
      ]
    },
    {
      group: "Brakes",
      params: [
        { key: "brake_bias", label: "Brake Bias (F)", unit: "%", min: 48.0, max: 70.0, step: 0.5, default: 57.5 },
        { key: "brake_duct_front", label: "Brake Duct F (0–6)", unit: "", min: 0, max: 6, step: 1, default: 2 },
        { key: "brake_duct_rear", label: "Brake Duct R (0–6)", unit: "", min: 0, max: 6, step: 1, default: 1 }
      ]
    },
    {
      group: "Electronics",
      params: [
        { key: "tc", label: "Traction Control (0–10)", unit: "", min: 0, max: 10, step: 1, default: 4 },
        { key: "abs", label: "ABS (0–10)", unit: "", min: 0, max: 10, step: 1, default: 3 },
        { key: "engine_map", label: "Engine Map (1–6)", unit: "", min: 1, max: 6, step: 1, default: 3 }
      ]
    },
    {
      group: "Strategy",
      params: [
        { key: "fuel_load", label: "Fuel Load", unit: " L", min: 1, max: 100, step: 1, default: 60 },
        { key: "tyre_compound", label: "Tyre Compound (1=Soft 2=Medium 3=Hard 4=Wet)", unit: "", min: 1, max: 4, step: 1, default: 2 },
        { key: "tyre_blankets", label: "Tyre Blankets (0=Off / 1=On)", unit: "", min: 0, max: 1, step: 1, default: 1 }
      ]
    }
  ],

  // ── AUTOMOBILISTA 2 ───────────────────────────────────────────────────────
  // AMS2 uses Madness Engine (same base as Project CARS 2). Springs in N/mm.
  // ARB on an integer 1–10 scale. Dampers on integer 1–20 scale (slow/fast bump/rebound).
  // Camber in degrees, toe in mm. Caster in degrees. Brake bias % front.
  // Electronics: TC 0–10, ABS 0–10, Engine Map 1–6.
  // Compounds: 1=Soft 2=Medium 3=Hard (+ 4=Wet available in wet sessions).
  // Fuel in litres. Brake pad 1–3 (1=Aggressive 2=Standard 3=Endurance).
  "Automobilista 2": [
    {
      group: "Tyres",
      params: [
        { key: "tyre_pressure_fl", label: "Pressure FL", unit: " PSI", min: 18.0, max: 40.0, step: 0.5, default: 27.0 },
        { key: "tyre_pressure_fr", label: "Pressure FR", unit: " PSI", min: 18.0, max: 40.0, step: 0.5, default: 27.0 },
        { key: "tyre_pressure_rl", label: "Pressure RL", unit: " PSI", min: 18.0, max: 40.0, step: 0.5, default: 26.5 },
        { key: "tyre_pressure_rr", label: "Pressure RR", unit: " PSI", min: 18.0, max: 40.0, step: 0.5, default: 26.5 }
      ]
    },
    {
      group: "Aerodynamics",
      params: [
        { key: "front_wing", label: "Front Wing (1–12)", unit: "", min: 1, max: 12, step: 1, default: 4 },
        { key: "rear_wing", label: "Rear Wing (1–12)", unit: "", min: 1, max: 12, step: 1, default: 6 },
        { key: "ride_height_front", label: "Ride Height F", unit: " mm", min: 45, max: 110, step: 1, default: 57 },
        { key: "ride_height_rear", label: "Ride Height R", unit: " mm", min: 50, max: 120, step: 1, default: 65 }
      ]
    },
    {
      group: "Alignment",
      params: [
        { key: "camber_front", label: "Camber F", unit: "°", min: -5.0, max: -0.5, step: 0.1, default: -3.4 },
        { key: "camber_rear", label: "Camber R", unit: "°", min: -4.0, max: -0.5, step: 0.1, default: -2.3 },
        { key: "toe_front", label: "Toe F", unit: " mm", min: -3.0, max: 3.0, step: 0.1, default: -0.3 },
        { key: "toe_rear", label: "Toe R", unit: " mm", min: -3.0, max: 3.0, step: 0.1, default: 0.8 },
        { key: "caster", label: "Caster", unit: "°", min: 7.0, max: 16.0, step: 0.5, default: 12.0 }
      ]
    },
    {
      group: "Mechanical Grip",
      params: [
        { key: "arb_front", label: "ARB F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "arb_rear", label: "ARB R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 4 },
        { key: "spring_front", label: "Spring Rate F", unit: " N/mm", min: 40, max: 250, step: 5, default: 90 },
        { key: "spring_rear", label: "Spring Rate R", unit: " N/mm", min: 40, max: 250, step: 5, default: 100 },
        { key: "bump_front", label: "Bump F (1–20)", unit: "", min: 1, max: 20, step: 1, default: 8 },
        { key: "bump_rear", label: "Bump R (1–20)", unit: "", min: 1, max: 20, step: 1, default: 8 },
        { key: "rebound_front", label: "Rebound F (1–20)", unit: "", min: 1, max: 20, step: 1, default: 10 },
        { key: "rebound_rear", label: "Rebound R (1–20)", unit: "", min: 1, max: 20, step: 1, default: 10 }
      ]
    },
    {
      group: "Differential",
      params: [
        { key: "diff_preload", label: "Preload", unit: " Nm", min: 0, max: 200, step: 5, default: 55 },
        { key: "diff_power", label: "Power Lock", unit: "%", min: 0, max: 100, step: 5, default: 60 },
        { key: "diff_coast", label: "Coast Lock", unit: "%", min: 0, max: 100, step: 5, default: 38 }
      ]
    },
    {
      group: "Brakes",
      params: [
        { key: "brake_bias", label: "Brake Bias (F)", unit: "%", min: 48.0, max: 70.0, step: 0.5, default: 57.0 },
        { key: "brake_duct_front", label: "Brake Duct F (0–6)", unit: "", min: 0, max: 6, step: 1, default: 2 },
        { key: "brake_duct_rear", label: "Brake Duct R (0–6)", unit: "", min: 0, max: 6, step: 1, default: 1 },
        { key: "brake_pad", label: "Brake Pad (1=Aggressive 2=Standard 3=Endurance)", unit: "", min: 1, max: 3, step: 1, default: 2 }
      ]
    },
    {
      group: "Electronics",
      params: [
        { key: "tc", label: "Traction Control (0–10)", unit: "", min: 0, max: 10, step: 1, default: 4 },
        { key: "abs", label: "ABS (0–10)", unit: "", min: 0, max: 10, step: 1, default: 3 },
        { key: "engine_map", label: "Engine Map (1–6)", unit: "", min: 1, max: 6, step: 1, default: 3 }
      ]
    },
    {
      group: "Strategy",
      params: [
        { key: "fuel_load", label: "Fuel Load", unit: " L", min: 1, max: 120, step: 1, default: 60 },
        { key: "tyre_compound", label: "Tyre Compound (1=Soft 2=Medium 3=Hard 4=Wet)", unit: "", min: 1, max: 4, step: 1, default: 2 },
        { key: "tyre_blankets", label: "Tyre Blankets (0=Off / 1=On)", unit: "", min: 0, max: 1, step: 1, default: 1 }
      ]
    }
  ],

  // ── RACEROOM ──────────────────────────────────────────────────────────────
  "RaceRoom": RACEROOM_SETUP_PARAMS,

  // ── GRAN TURISMO 7 ────────────────────────────────────────────────────────
  // GT7 setup screen uses kPa for pressures. Springs in kgf/mm. ARB 1–7 integer.
  // Dampers: Extension (rebound) and Compression (bump) on 1–10 scale.
  // Alignment: camber in degrees, toe in degrees (GT7 uses degrees, not mm).
  // NO caster adjustment in GT7 (fixed by car model).
  // LSD: Initial Torque 5–50, Acceleration Sensitivity 5–60, Deceleration Sensitivity 5–60.
  // Brake balance: front/rear 1–20 slider (higher = more front).
  // Aerodynamics: GT7 uses downforce values in the range ~0–650 (front) / ~0–900 (rear)
  // depending on the car's aero kit. Numbers represent the actual downforce level shown in-game.
  // Tyre compounds: 1=SH (Super Hard) 2=H (Hard) 3=M (Medium) 4=S (Soft) 5=SS (Super Soft)
  //                 6=RH (Racing Hard) 7=RM (Racing Medium) 8=RS (Racing Soft) 9=IM (Intermediate) 10=W (Wet)
  // Fuel in litres. Ballast in kg.
  "Gran Turismo 7": [
    {
      group: "Tyres",
      params: [
        { key: "tyre_pressure_fl", label: "Pressure FL", unit: " kPa", min: 150, max: 400, step: 5, default: 230 },
        { key: "tyre_pressure_fr", label: "Pressure FR", unit: " kPa", min: 150, max: 400, step: 5, default: 230 },
        { key: "tyre_pressure_rl", label: "Pressure RL", unit: " kPa", min: 150, max: 400, step: 5, default: 220 },
        { key: "tyre_pressure_rr", label: "Pressure RR", unit: " kPa", min: 150, max: 400, step: 5, default: 220 }
      ]
    },
    {
      group: "Body Height & Springs",
      params: [
        { key: "ride_height_front", label: "Body Height F", unit: " mm", min: 50, max: 200, step: 1, default: 90 },
        { key: "ride_height_rear", label: "Body Height R", unit: " mm", min: 50, max: 200, step: 1, default: 95 },
        { key: "spring_front", label: "Spring Rate F", unit: " kgf/mm", min: 1.0, max: 30.0, step: 0.5, default: 8.0 },
        { key: "spring_rear", label: "Spring Rate R", unit: " kgf/mm", min: 1.0, max: 30.0, step: 0.5, default: 9.0 }
      ]
    },
    {
      group: "Dampers & ARB",
      params: [
        { key: "damper_ext_front", label: "Damper Extension F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "damper_ext_rear", label: "Damper Extension R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "damper_comp_front", label: "Damper Compression F (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "damper_comp_rear", label: "Damper Compression R (1–10)", unit: "", min: 1, max: 10, step: 1, default: 5 },
        { key: "arb_front", label: "Anti-Roll Bar F (1–7)", unit: "", min: 1, max: 7, step: 1, default: 4 },
        { key: "arb_rear", label: "Anti-Roll Bar R (1–7)", unit: "", min: 1, max: 7, step: 1, default: 3 }
      ]
    },
    {
      group: "Alignment",
      params: [
        { key: "camber_front", label: "Camber F", unit: "°", min: -5.0, max: 0.0, step: 0.1, default: -2.0 },
        { key: "camber_rear", label: "Camber R", unit: "°", min: -5.0, max: 0.0, step: 0.1, default: -1.5 },
        { key: "toe_front", label: "Toe F", unit: "°", min: -2.5, max: 2.5, step: 0.05, default: -0.10 },
        { key: "toe_rear", label: "Toe R", unit: "°", min: -2.5, max: 2.5, step: 0.05, default: 0.20 }
      ]
    },
    {
      group: "LSD (Differential)",
      params: [
        { key: "lsd_initial", label: "Initial Torque (5–50)", unit: "", min: 5, max: 50, step: 5, default: 20 },
        { key: "lsd_accel", label: "Accel Sensitivity (5–60)", unit: "", min: 5, max: 60, step: 5, default: 30 },
        { key: "lsd_decel", label: "Decel Sensitivity (5–60)", unit: "", min: 5, max: 60, step: 5, default: 20 }
      ]
    },
    {
      group: "Brakes",
      params: [
        { key: "brake_balance", label: "Brake Balance (1–20, higher=more front)", unit: "", min: 1, max: 20, step: 1, default: 10 }
      ]
    },
    {
      group: "Aerodynamics",
      params: [
        { key: "downforce_front", label: "Downforce F (aero kit dependent)", unit: "", min: 0, max: 650, step: 5, default: 300 },
        { key: "downforce_rear", label: "Downforce R (aero kit dependent)", unit: "", min: 0, max: 900, step: 5, default: 400 }
      ]
    },
    {
      group: "Transmission",
      params: [
        { key: "final_gear_ratio", label: "Final Gear Ratio", unit: "", min: 2.50, max: 5.50, step: 0.01, default: 3.50 },
        { key: "power_limiter", label: "Power Limiter", unit: "%", min: 50, max: 100, step: 1, default: 100 }
      ]
    },
    {
      group: "Strategy",
      params: [
        { key: "fuel_load", label: "Fuel Load", unit: " L", min: 1, max: 100, step: 1, default: 50 },
        { key: "ballast", label: "Ballast", unit: " kg", min: 0, max: 100, step: 5, default: 0 },
        { key: "tyre_compound", label: "Tyre Compound (1=SH 2=H 3=M 4=S 5=SS 6=RH 7=RM 8=RS 9=IM 10=W)", unit: "", min: 1, max: 10, step: 1, default: 7 }
      ]
    }
  ]
};

// ─────────────────────────────────────────────
// SIM → TYRE CLASS MAPPING
// ─────────────────────────────────────────────
export const SIM_TYRE_CLASSES = {
  "iRacing": ["GT3", "GT4", "GTE", "LMP / Prototype", "Open Wheel", "Touring / TCR", "Stock Car / NASCAR"],
  "Assetto Corsa Competizione": ["GT3", "GT4", "GT2", "GTE", "Cup Car"],
  "Assetto Corsa": ["GT3", "GT4", "GTE", "LMP / Prototype", "Touring / TCR", "Road Car (Sport)"],
  "Assetto Corsa Evo": ["GT3", "GT4", "GTE", "Cup Car", "Touring / TCR", "Road Car (Sport)"],
  "Le Mans Ultimate": ["Hypercar (LMH/LMDh)", "LMP / Prototype", "GT3", "GTE"],
  "Automobilista 2": ["GT3", "GT4", "GTE", "LMP / Prototype", "Cup Car", "Touring / TCR", "Open Wheel", "Stock Car / NASCAR", "Historic"],
  "Gran Turismo 7": ["GT3", "GT4", "Touring / TCR", "Road Car (Sport)", "Historic"],
  "RaceRoom": ["GT3", "GT4", "DTM", "Touring / TCR", "Formula", "Group C / Prototype", "NASCAR"]
};

// ─────────────────────────────────────────────
// TYRE PRESSURE BASES — optimal hot targets by class
// ─────────────────────────────────────────────
export const TYRE_PRESSURE_BASES = {
  "GT3": { acc: 27.5, iracing: 29.0, ams2: 27.0, ac: 27.3, ace: 27.5, lmu_kpa: 192, gt7_kpa: 230 },
  "GT4": { acc: 27.0, iracing: 28.5, ams2: 26.5, ac: 27.0, ace: 27.0, lmu_kpa: 190, gt7_kpa: 225 },
  "GTE": { acc: 27.0, iracing: 28.5, ams2: 26.5, ac: 27.0, ace: 27.0, lmu_kpa: 188, gt7_kpa: 225 },
  "GT2": { acc: 28.0, iracing: 29.5, ams2: 28.0, ac: 28.0, ace: 28.0, lmu_kpa: 195, gt7_kpa: 235 },
  "LMP / Prototype": { acc: 26.0, iracing: 28.0, ams2: 25.5, ac: 26.0, ace: 26.0, lmu_kpa: 185, gt7_kpa: 220 },
  "Hypercar (LMH/LMDh)": { acc: 26.0, iracing: 27.5, ams2: 25.5, ac: 26.0, ace: 26.0, lmu_kpa: 182, gt7_kpa: 218 },
  "Open Wheel": { acc: 25.0, iracing: 27.5, ams2: 25.0, ac: 25.0, ace: 25.0, lmu_kpa: 180, gt7_kpa: 210 },
  "Touring / TCR": { acc: 29.0, iracing: 30.0, ams2: 29.0, ac: 29.0, ace: 29.0, lmu_kpa: 200, gt7_kpa: 240 },
  "Cup Car": { acc: 28.5, iracing: 29.5, ams2: 28.0, ac: 28.0, ace: 28.5, lmu_kpa: 196, gt7_kpa: 235 },
  "Stock Car / NASCAR": { acc: 30.0, iracing: 34.0, ams2: 30.0, ac: 30.0, ace: 30.0, lmu_kpa: 210, gt7_kpa: 250 },
  "Road Car (Sport)": { acc: 30.0, iracing: 32.0, ams2: 30.0, ac: 30.0, ace: 30.0, lmu_kpa: 210, gt7_kpa: 245 },
  "Historic": { acc: 26.0, iracing: 28.0, ams2: 26.0, ac: 26.0, ace: 26.0, lmu_kpa: 185, gt7_kpa: 215 },
  "DTM": { acc: 28.0, iracing: 29.0, ams2: 28.0, ac: 28.0, ace: 28.0, lmu_kpa: 194, gt7_kpa: 235, raceroom: 28.0 }
};

// ─────────────────────────────────────────────
// TRACK TIPS
// ─────────────────────────────────────────────
export const TRACK_TIPS = {
  "Spa-Francorchamps": {
    character: "High-speed, flowing, elevation changes",
    wing: "Medium-high",
    tips: "Run medium-high downforce for Eau Rouge confidence. Stiffer front ARB helps at the Bus Stop chicane. Watch brake temps on the long descent to Rivage. Pouhon demands rear stability — run sufficient rear wing."
  },
  "Monza": {
    character: "Low downforce, heavy braking",
    wing: "Minimum",
    tips: "Minimum wing for top speed. Increase brake cooling — the chicanes are brutal. Stiffer rear springs help stability at Parabolica/Ascari. Tyre wear is low so run qualifying-focused pressures."
  },
  "Nürburgring GP": {
    character: "Technical, heavy braking, mixed speed",
    wing: "Medium-high",
    tips: "Brake-heavy track — open cooling ducts. Medium-high downforce works best. Softer front springs for the bumpy final sector (Mercedes arena). The hairpin requires max diff lock for traction."
  },
  "Silverstone": {
    character: "Fast and flowing, smooth surface",
    wing: "Medium",
    tips: "The fast sweeps reward good aero balance. Medium wing with a focus on front-end response. Maggots-Becketts-Chapel is the litmus test — the car must be planted without oversteer through this complex."
  },
  "Bathurst": {
    character: "Extreme elevation, tight and fast sections",
    wing: "High",
    tips: "Maximum downforce for mountain confidence. Soft bump damping for the rough surface at the top of the mountain. Watch ride height — cars can bottom out. Conrod Straight requires high top speed but mountain needs grip."
  },
  "Suzuka": {
    character: "Flowing, technical, demanding",
    wing: "Medium-high",
    tips: "The Esses punish poor aero balance. Prioritize front-end stability through fast sections. Softer rear ARB helps traction at the Hairpin. 130R needs maximum high-speed rear grip — run enough wing."
  },
  "Brands Hatch GP": {
    character: "Short, undulating, blind crests",
    wing: "Medium-high",
    tips: "Elevation changes are extreme. Soft bump damping is essential. More front downforce for Paddock Hill Bend — confidence here is everything. High-speed Druids needs a stable rear."
  },
  "Imola": {
    character: "Technical, bumpy, mixed speed",
    wing: "Medium",
    tips: "Bumpy surface means softer bump damping. Technical track with a mix of slow chicanes and fast sweepers. Acque Minerale benefits from good traction setup. Brake balance needs to be carefully tuned."
  },
  "Le Mans": {
    character: "Ultra-high speed, long straights",
    wing: "Minimum (Hypercars) / Medium (GT)",
    tips: "Hypercars need minimum drag configurations on the Mulsanne. The Porsche Curves require mechanical grip. Ford Chicanes need a calm, stable car under braking. Mulsanne kink at 330+ km/h demands absolute high-speed rear stability."
  },
  "Circuit de Catalunya": {
    character: "Mixed speed, tyre-punishing",
    wing: "Medium-high",
    tips: "Notorious for tyre degradation — especially fronts. Run conservative camber to protect the inner edge. Turn 3 (fast right after the back straight) is critical for aero balance diagnosis."
  },
  "Laguna Seca": {
    character: "Technical, undulating, Corkscrew",
    wing: "Medium",
    tips: "The Corkscrew blind crest requires confidence in high-speed stability. Suspension needs to be soft enough to absorb the landing. Turn 2 is the key slow corner for traction setup."
  },
  "Red Bull Ring": {
    character: "Short, elevation, heavy braking",
    wing: "Medium",
    tips: "Uphill sections require good traction. Turn 1 and Turn 3 are the two big braking zones — monitor temps. Short track means tyres go through fewer full cycles, so cold-start setup matters."
  },
  "Hungaroring": {
    character: "Twisty, slow-medium, track evolution",
    wing: "High",
    tips: "One of the slowest circuits. High downforce helps everywhere. Differential settings matter more here than anywhere else. The track rubbers in significantly over a race — setup that works at the start may be different late."
  },
  "Nürburgring Nordschleife": {
    character: "Extreme variety, 26km, unpredictable",
    wing: "Medium",
    tips: "Softest suspension possible for the bumps. Higher ride height than anywhere else. Conservative pressure settings for the 8-min heat cycle. Brake cooling critical over the full distance."
  }
};

// ─────────────────────────────────────────────
// GT3 BASELINE SETUPS (starting point references)
// ─────────────────────────────────────────────
export const BASELINE_SETUPS = {
  "Porsche 911 GT3 R (992) — ACC": {
    car: "Porsche 911 GT3 R (992)",
    sim: "Assetto Corsa Competizione",
    notes: "Balanced starting setup. The 992 carries its weight well rearward so power lock can be high. Watch front tyre wear — the car naturally understeers under power.",
    params: {
      tyre_pressure_fl: 27.3, tyre_pressure_fr: 27.3, tyre_pressure_rl: 26.8, tyre_pressure_rr: 26.8,
      front_splitter: 1, rear_wing: 7, ride_height_front: 56, ride_height_rear: 65,
      camber_front: -3.5, camber_rear: -2.3, toe_front: -0.3, toe_rear: 0.9, caster: 13.0,
      arb_front: 4, arb_rear: 5, spring_front: 85, spring_rear: 110, bump_front: 4, bump_rear: 5, rebound_front: 5, rebound_rear: 5,
      diff_preload: 55, diff_power: 75, diff_coast: 45, brake_bias: 57.5, brake_duct_front: 2, brake_duct_rear: 2,
      tc1: 4, tc2: 3, abs: 3, engine_map: 5
    }
  },
  "Ferrari 296 GT3 — ACC": {
    car: "Ferrari 296 GT3",
    sim: "Assetto Corsa Competizione",
    notes: "Mid-engine, balanced car. Responds well to front splitter adjustments. Monitor rear tyre temps as this car can work the rears hard.",
    params: {
      tyre_pressure_fl: 27.5, tyre_pressure_fr: 27.5, tyre_pressure_rl: 27.0, tyre_pressure_rr: 27.0,
      front_splitter: 2, rear_wing: 6, ride_height_front: 57, ride_height_rear: 63,
      camber_front: -3.7, camber_rear: -2.5, toe_front: -0.4, toe_rear: 0.8, caster: 12.5,
      arb_front: 5, arb_rear: 4, spring_front: 95, spring_rear: 100, bump_front: 4, bump_rear: 4, rebound_front: 4, rebound_rear: 5,
      diff_preload: 60, diff_power: 60, diff_coast: 38, brake_bias: 57.8, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 5, tc2: 4, abs: 3, engine_map: 5
    }
  },
  "McLaren 720S GT3 EVO — ACC": {
    car: "McLaren 720S GT3 EVO",
    sim: "Assetto Corsa Competizione",
    notes: "RWD, aggressive aerodynamics. The McLaren loves trail-braking and rewards a lower diff coast setting. Front camber is critical for this car.",
    params: {
      tyre_pressure_fl: 27.2, tyre_pressure_fr: 27.2, tyre_pressure_rl: 26.8, tyre_pressure_rr: 26.8,
      front_splitter: 1, rear_wing: 5, ride_height_front: 59, ride_height_rear: 64,
      camber_front: -3.8, camber_rear: -2.6, toe_front: -0.5, toe_rear: 0.7, caster: 12.0,
      arb_front: 6, arb_rear: 3, spring_front: 90, spring_rear: 95, bump_front: 5, bump_rear: 3, rebound_front: 5, rebound_rear: 4,
      diff_preload: 50, diff_power: 55, diff_coast: 35, brake_bias: 56.5, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 4, tc2: 3, abs: 2, engine_map: 5
    }
  },
  "BMW M4 GT3 — ACC": {
    car: "BMW M4 GT3",
    sim: "Assetto Corsa Competizione",
    notes: "Front-engine, planted feel. Higher diff lock works well due to front-engine weight. Stiffer front springs than default help turn-in.",
    params: {
      tyre_pressure_fl: 27.4, tyre_pressure_fr: 27.4, tyre_pressure_rl: 27.0, tyre_pressure_rr: 27.0,
      front_splitter: 2, rear_wing: 6, ride_height_front: 58, ride_height_rear: 62,
      camber_front: -3.4, camber_rear: -2.3, toe_front: -0.3, toe_rear: 0.9, caster: 13.5,
      arb_front: 5, arb_rear: 4, spring_front: 100, spring_rear: 95, bump_front: 4, bump_rear: 4, rebound_front: 5, rebound_rear: 4,
      diff_preload: 70, diff_power: 65, diff_coast: 42, brake_bias: 58.2, brake_duct_front: 2, brake_duct_rear: 2,
      tc1: 4, tc2: 3, abs: 3, engine_map: 5
    }
  }
};

// ─────────────────────────────────────────────
// CORNER TYPE GUIDE
// ─────────────────────────────────────────────
export const CORNER_TYPE_GUIDE = [
  {
    type: "Tight Hairpin",
    icon: "RotateCcw",
    description: "Very slow, often 1st or 2nd gear corners at the end of long straights. Maximum rotation required.",
    exampleCorners: ["La Source (Spa)", "Raidillon Hairpin (Spa)", "Stowe (Silverstone)", "Hairpin (Red Bull Ring)"],
    setup: {
      diff: "Low diff power lock (45–55%) to allow rotation. Medium preload.",
      springs: "Softer rear springs for mechanical grip on exit.",
      arb: "Softer rear ARB to allow outside wheel to load up.",
      aero: "Low wing setting has minimal benefit here — mechanical grip dominates.",
      geometry: "Maximum caster for camber gain. Standard camber values."
    },
    technique: "Late apex, maximum throttle at apex or just after. Rotate the car with lift-off if needed. Avoid attacking kerbs that cause wheel hop.",
    priority: "Traction out of the hairpin is the priority — the approach is sacrificed for exit speed."
  },
  {
    type: "Fast Sweeper",
    icon: "TrendingRight",
    description: "High-speed constant-radius bends at 4th gear and above. Taken at near-maximum speed.",
    exampleCorners: ["Eau Rouge/Raidillon (Spa)", "Maggots-Becketts (Silverstone)", "130R (Suzuka)", "Pouhon (Spa)"],
    setup: {
      diff: "Higher diff preload for stability. Medium coast lock.",
      springs: "Stiffer springs to prevent aero ride height changes at speed.",
      arb: "Medium-stiff ARB to control body roll at high speed.",
      aero: "Rear wing is critical here — if you're not confident, add a click.",
      geometry: "More negative front camber helps. Rear toe-in essential for stability."
    },
    technique: "Commit fully and carry maximum speed. These corners separate fast setups from slow ones — if your car isn't planted, don't force it.",
    priority: "High-speed rear stability. Any instability through these corners indicates an aero or platform problem."
  },
  {
    type: "Chicane / Direction Change",
    icon: "ArrowLeftRight",
    description: "Rapid left-right or right-left transitions. Tests transitional stability and mechanical balance.",
    exampleCorners: ["Bus Stop (Spa)", "Variante Ascari (Monza)", "Variante del Rettifilo (Monza)", "Adelaide (Silverstone)"],
    setup: {
      diff: "Medium preload for smooth transitions. Avoid very low preload.",
      springs: "Stiffer rebound damping to control the side-to-side movement.",
      arb: "Stiffer rear ARB helps resist the direction change oversteer.",
      aero: "Not particularly sensitive to aero settings.",
      geometry: "Rear toe-in is critical for directional stability during direction changes."
    },
    technique: "Smooth inputs — don't jerk the wheel. Let the car settle between apices. The second apex is usually more important than the first.",
    priority: "Transitional stability. If the rear steps out between apex 1 and apex 2, increase rear toe-in and stiffen rear bump/rebound."
  },
  {
    type: "Off-Camber Turn",
    icon: "TrendingDown",
    description: "The track surface falls away from the car on the outside of the corner, reducing available grip.",
    exampleCorners: ["Turn 8 Türkiye (Istanbul)", "Becketts (Silverstone, outer banking)", "Turn 6 Laguna Seca"],
    setup: {
      diff: "Lower diff settings to allow the car to follow the road.",
      springs: "Softer bump damping to keep tyres in contact with the falling surface.",
      arb: "Softer ARBs allow each wheel to move independently on the variable surface.",
      aero: "More downforce helps compress the car onto the road surface.",
      geometry: "Slightly more negative camber on the front compensates for the geometric camber loss."
    },
    technique: "Be very smooth on inputs. The grip disappears suddenly if you exceed the limit. Be earlier to the throttle rather than later to maintain downforce.",
    priority: "Tyre compliance and downforce. Stiff setups lose grip completely in off-camber sections."
  },
  {
    type: "Uphill Corner",
    icon: "TrendingUp",
    description: "The track climbs through the corner, adding load to the car through the apex.",
    exampleCorners: ["Eau Rouge uphill (Spa)", "Mountain section (Bathurst)", "Aintree (Silverstone new section)"],
    setup: {
      diff: "Standard diff settings work well — extra grip from the gradient helps.",
      springs: "Slightly lower rear spring rate to prevent the car from becoming light on exit.",
      arb: "Rear ARB can be slightly stiffer as the added grip reduces the oversteer risk.",
      aero: "Less rear wing can work here as the gradient naturally loads the rear.",
      geometry: "Standard geometry — the car is being pressed into the road."
    },
    technique: "Uphill corners feel grippier than flat equivalents — you can carry more speed than you think. Be aggressive on the throttle as the upward gradient helps maintain rear traction.",
    priority: "Exit speed. These are usually followed by straights or high-speed sections."
  },
  {
    type: "Downhill Corner",
    icon: "TrendingDown",
    description: "The track descends through the corner, reducing load and making the car feel light.",
    exampleCorners: ["Paddock Hill Bend (Brands Hatch)", "Conrod Straight chicane approach (Bathurst)", "Descending to T1 Zandvoort"],
    setup: {
      diff: "Higher preload for stability as rear unloads.",
      springs: "Stiffer front bump to prevent the nose from diving and unloading the rear.",
      arb: "Stiffer rear ARB helps maintain rear stability as weight moves forward and off the rear.",
      aero: "More rear wing to compensate for the rear unloading at speed.",
      geometry: "More rear toe-in for additional directional stability on the downhill approach."
    },
    technique: "The car is light and wants to go straight or oversteer. Be patient with steering inputs and avoid sudden direction changes. Braking must be progressive.",
    priority: "Stability and confidence. A car that's nervous downhill will cost significant lap time due to driver hesitation."
  },
  {
    type: "Long Medium-Speed Corner",
    icon: "Circle",
    description: "Long, constant-radius corners taken in 3rd–4th gear. Expose tyre degradation and sustained grip levels.",
    exampleCorners: ["Copse (Silverstone old layout)", "Turn 3 (Circuit de Catalunya)", "Rivage (Spa)"],
    setup: {
      diff: "Medium diff lock — needs rotation but also traction on exit.",
      springs: "Softer front springs improve sustained front grip over the length of the corner.",
      arb: "Softer front ARB for more front mechanical grip through the sustained arc.",
      aero: "Medium wing — these corners reward a balanced car more than maximum downforce.",
      geometry: "Camber settings are critical — tyres work hard for extended periods. Use tyre temp data from these corners to optimize."
    },
    technique: "These corners test your ability to maintain a consistent throttle input. Build up the throttle very smoothly. Pushing the tyre continuously exposes any overheating issues.",
    priority: "Balanced grip and tyre management. Setup changes that work here often transfer well to the whole lap."
  },
  {
    type: "High-Speed Kink",
    icon: "Zap",
    description: "A small direction change at very high speed — often not even a 'corner' in the traditional sense.",
    exampleCorners: ["Kink at Road America", "Mulsanne Straight kink (Le Mans)", "Fisichella (Spa Eau Rouge flat?)", "Tamburello Chicane approach"],
    setup: {
      diff: "High preload for directional stability at speed.",
      springs: "Stiff springs to prevent any body movement affecting aero efficiency.",
      arb: "Stiff ARBs maintain platform stability at speed.",
      aero: "This is where rear wing setting matters most — marginal wing at these speeds can cause instability.",
      geometry: "Rear toe-in is essential — it creates passive yaw resistance at high speed."
    },
    technique: "Many drivers lift slightly before kinks — work on committing flat. The key is a very slight steering input — any abruptness causes instability. Confidence comes from a planted rear.",
    priority: "High-speed rear stability. This is purely a platform and downforce problem — fix the car before fixing the technique."
  }
];