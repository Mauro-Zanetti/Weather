namespace db;

type WeatherCondition : {
    humidity : Decimal(4, 1);
    temp     : Decimal(5, 2);
    temp_min : Decimal(5, 2);
    temp_max : Decimal(5, 2);
}

entity Weather {
    key id   : Integer64;
        name : String;
        cod  : Integer64;
        main : WeatherCondition
}
