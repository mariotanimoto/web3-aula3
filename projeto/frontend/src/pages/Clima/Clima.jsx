import { useCallback, useEffect, useState } from 'react';
import {
    Cloud,
    CloudFog,
    CloudRain,
    CloudSnow,
    CloudSun,
    Droplets,
    LoaderCircle,
    MapPin,
    RefreshCw,
    Sunrise,
    Sunset,
    Sun,
    Thermometer,
    Wind,
} from 'lucide-react';
import { getClima } from '../../services/climaService';
import './Clima.css';

const CIDADES = ['Paranaguá', 'Curitiba', 'Matinhos'];

const CONDICOES = {
    0: { descricao: 'Céu limpo', Icone: Sun },
    1: { descricao: 'Predominantemente limpo', Icone: CloudSun },
    2: { descricao: 'Parcialmente nublado', Icone: CloudSun },
    3: { descricao: 'Nublado', Icone: Cloud },
    45: { descricao: 'Nevoeiro', Icone: CloudFog },
    48: { descricao: 'Nevoeiro com geada', Icone: CloudFog },
    51: { descricao: 'Garoa leve', Icone: CloudRain },
    53: { descricao: 'Garoa moderada', Icone: CloudRain },
    55: { descricao: 'Garoa intensa', Icone: CloudRain },
    56: { descricao: 'Garoa congelante leve', Icone: CloudSnow },
    57: { descricao: 'Garoa congelante intensa', Icone: CloudSnow },
    61: { descricao: 'Chuva leve', Icone: CloudRain },
    63: { descricao: 'Chuva moderada', Icone: CloudRain },
    65: { descricao: 'Chuva intensa', Icone: CloudRain },
    66: { descricao: 'Chuva congelante leve', Icone: CloudSnow },
    67: { descricao: 'Chuva congelante intensa', Icone: CloudSnow },
    71: { descricao: 'Neve leve', Icone: CloudSnow },
    73: { descricao: 'Neve moderada', Icone: CloudSnow },
    75: { descricao: 'Neve intensa', Icone: CloudSnow },
    77: { descricao: 'Grãos de neve', Icone: CloudSnow },
    80: { descricao: 'Pancadas de chuva leves', Icone: CloudRain },
    81: { descricao: 'Pancadas de chuva moderadas', Icone: CloudRain },
    82: { descricao: 'Pancadas de chuva violentas', Icone: CloudRain },
    85: { descricao: 'Pancadas de neve leves', Icone: CloudSnow },
    86: { descricao: 'Pancadas de neve intensas', Icone: CloudSnow },
    95: { descricao: 'Trovoada', Icone: CloudRain },
    96: { descricao: 'Trovoada com granizo leve', Icone: CloudRain },
    99: { descricao: 'Trovoada com granizo intenso', Icone: CloudRain },
};

function formatarHora(valor) {
    if (!valor) return '--:--';
    return valor.slice(11, 16);
}

function formatarDia(valor, indice) {
    if (!valor) return '';
    if (indice === 0) return 'Hoje';
    const data = new Date(`${valor}T12:00:00`);
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit' })
        .format(data)
        .replace('.', '');
}

function obterCondicao(codigo) {
    return CONDICOES[codigo] || { descricao: 'Condição não identificada', Icone: Cloud };
}

function Clima() {
    const [cidadeSelecionada, setCidadeSelecionada] = useState('Curitiba');
    const [clima, setClima] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const carregarClima = useCallback(async (cidade) => {
        setCarregando(true);
        setErro('');
        try {
            const dados = await getClima(cidade);
            setClima(dados);
        } catch (error) {
            console.error('Erro ao carregar clima:', error);
            setClima(null);
            setErro(error.response?.data?.error || 'Não foi possível carregar os dados.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarClima(cidadeSelecionada);
    }, [cidadeSelecionada, carregarClima]);

    const atual = clima?.atual;
    const diaria = clima?.previsaoDiaria;
    const condicaoAtual = obterCondicao(atual?.weather_code);
    const IconeAtual = condicaoAtual.Icone;

    return (
        <section className="clima-page">
            <header className="clima-header">
                <div>
                    <span className="clima-eyebrow">PREVISÃO DO TEMPO</span>
                    <h1>Clima</h1>

                </div>
                <button
                    type="button"
                    className="clima-refresh"
                    onClick={() => carregarClima(cidadeSelecionada)}
                    disabled={carregando}
                    title="Atualizar previsão"
                >
                    <RefreshCw size={18} className={carregando ? 'clima-spinning' : ''} />
                    Atualizar
                </button>
            </header>

            <div className="clima-city-selector" role="group" aria-label="Selecionar cidade">
                {CIDADES.map((cidade) => (
                    <button
                        key={cidade}
                        type="button"
                        className={`clima-city-option ${cidadeSelecionada === cidade ? 'selected' : ''}`}
                        onClick={() => setCidadeSelecionada(cidade)}
                        aria-pressed={cidadeSelecionada === cidade}
                    >
                        <MapPin size={16} />
                        {cidade}
                    </button>
                ))}
            </div>

            {carregando ? (
                <div className="clima-state">
                    <LoaderCircle size={30} className="clima-spinning" />
                    <span>Carregando previsão para {cidadeSelecionada}...</span>
                </div>
            ) : erro ? (
                <div className="clima-error" role="alert">
                    <Cloud size={28} />
                    <div>
                        <strong>Não foi possível obter o clima</strong>
                        <p>{erro}</p>
                        <button type="button" className="clima-retry" onClick={() => carregarClima(cidadeSelecionada)}>
                            Tentar novamente
                        </button>
                    </div>
                </div>
            ) : clima && atual ? (
                <>
                    <article className="clima-current-card">
                        <div className="clima-current-main">
                            <div className="clima-location">
                                <MapPin size={16} />
                                <span>{clima.localizacao.nome}, {clima.localizacao.regiao}</span>
                            </div>
                            <div className="clima-temperature-row">
                                <IconeAtual size={76} strokeWidth={1.4} />
                                <div>
                                    <div className="clima-temperature">{Math.round(atual.temperature_2m)}°</div>
                                    <div className="clima-condition">{condicaoAtual.descricao}</div>
                                </div>
                            </div>
                            <p className="clima-feels-like">Sensação térmica de {Math.round(atual.apparent_temperature)}°</p>
                        </div>
                        <div className="clima-current-details">
                            <div className="clima-detail-item">
                                <Thermometer size={19} />
                                <div><span>Temperatura</span><strong>{atual.temperature_2m} {clima.unidade?.temperatura || '°C'}</strong></div>
                            </div>
                            <div className="clima-detail-item">
                                <Droplets size={19} />
                                <div><span>Umidade</span><strong>{atual.relative_humidity_2m}%</strong></div>
                            </div>
                            <div className="clima-detail-item">
                                <Wind size={19} />
                                <div><span>Vento</span><strong>{atual.wind_speed_10m} {clima.unidade?.velocidadeVento || 'km/h'}</strong></div>
                            </div>
                            <div className="clima-detail-item">
                                <CloudRain size={19} />
                                <div><span>Precipitação</span><strong>{atual.precipitation} {clima.unidade?.precipitacao || 'mm'}</strong></div>
                            </div>

                        </div>
                    </article>

                    <section className="clima-forecast-section">
                        <div className="clima-section-heading">
                            <div>
                                <h2>Próximos dias</h2>
                                <p>Previsão para os próximos cinco dias</p>
                            </div>
                        </div>
                        <div className="clima-forecast-grid">
                            {(diaria?.time || []).map((dia, indice) => {
                                const condicao = obterCondicao(diaria.weather_code[indice]);
                                const Icone = condicao.Icone;
                                return (
                                    <article className="clima-forecast-card" key={dia}>
                                        <span className="clima-forecast-day">{formatarDia(dia, indice)}</span>
                                        <Icone size={34} strokeWidth={1.5} />
                                        <span className="clima-forecast-condition">{condicao.descricao}</span>
                                        <div className="clima-forecast-temperatures">
                                            <strong>{Math.round(diaria.temperature_2m_max[indice])}°</strong>
                                            <span>{Math.round(diaria.temperature_2m_min[indice])}°</span>
                                        </div>
                                        <div className="clima-forecast-rain">
                                            <Droplets size={14} />
                                            {diaria.precipitation_probability_max?.[indice] ?? 0}%
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </>
            ) : null}
        </section>
    );
}

export default Clima;
