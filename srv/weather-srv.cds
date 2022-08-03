using {db} from '../db/Weather';

@Capabilities.KeyAsSegmentSupported : true
service WeatherService {
    @readonly
    entity CurrentWeather as projection on db.Weather;
}