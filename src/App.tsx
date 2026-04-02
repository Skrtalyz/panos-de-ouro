/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MessageCircle,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isEnded) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setIsEnded(false);
      return;
    }

    if (!hasStarted) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
  };

  return (
    <div className="relative group cursor-pointer" onClick={togglePlay}>
      <video 
        ref={videoRef}
        src={src} 
        autoPlay 
        muted 
        playsInline
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-auto block"
      />
      
      {/* Audio Notice */}
      <AnimatePresence>
        {!hasStarted && !isEnded && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-4 right-4 flex justify-center z-20 pointer-events-none"
          >
            <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest border border-white/20 shadow-xl">
              <Volume2 size={16} className="animate-pulse" />
              CLIQUE PARA ASSISTIR COM ÁUDIO
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {(!isPlaying || isEnded) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl"
            >
              {isEnded ? (
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw size={32} />
                  <span className="text-[10px] font-black uppercase">Ver de novo</span>
                </div>
              ) : (
                <Play size={40} className="ml-1" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Pause Indicator on Hover when playing */}
      <AnimatePresence>
        {isPlaying && !isEnded && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center">
              <Pause size={32} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Button = ({ children, className = "", primary = false, href, ...props }: { children: React.ReactNode, className?: string, primary?: boolean, href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const getFinalHref = (baseHref: string) => {
    if (typeof window === 'undefined') return baseHref;
    const search = window.location.search;
    if (!search) return baseHref;
    
    const separator = baseHref.includes('?') ? '&' : '?';
    const cleanSearch = search.startsWith('?') ? search.substring(1) : search;
    return `${baseHref}${separator}${cleanSearch}`;
  };

  const finalHref = href ? getFinalHref(href) : undefined;
  const Component = href ? motion.a : motion.button;
  const extraProps = href ? { href: finalHref, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Component
      {...props}
      {...extraProps as any}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.3)" }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-3 px-6 rounded-xl font-black text-base md:text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-tight bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer ${className}`}
    >
      {children}
    </Component>
  );
};

const FlippingButton = ({ text1, text2, className = "", href }: { text1: string, text2: string, className?: string, href?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Button 
      className={className}
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
    >
      {(isHovered || isClicked) ? text2 : text1}
    </Button>
  );
};

const SectionTitle = ({ children, light = false }: { children: React.ReactNode, light?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-10"
  >
    <h2 className={`text-xl md:text-4xl mb-4 tracking-tighter uppercase ${light ? "text-white" : "text-primary"}`}>{children}</h2>
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 96 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className={`h-1.5 mx-auto mt-3 rounded-full ${light ? "bg-white/30" : "bg-primary/20"}`} 
    />
  </motion.div>
);

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true }
};

const CHECKOUT_URL = "https://pay.lowify.com.br/checkout.php?product_id=uhdF3P";

export default function App() {
  return (
    <div className="min-h-screen selection:bg-primary/20 font-sans bg-bg-soft overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative flex flex-col md:block min-h-screen md:min-h-[600px] bg-white md:bg-stone-100 overflow-hidden">
        {/* Mobile Image Container */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="md:hidden w-full h-[45vh] relative shrink-0"
        >
          <img 
            src="https://i.postimg.cc/B6cf1wCq/Design-sem-nome-(23).png" 
            alt="Pilha de Panos de Prato" 
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Desktop Background */}
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="hidden md:block absolute inset-0 pointer-events-none"
        >
          <img 
            src="https://i.postimg.cc/WpG1M54k/Design-sem-nome.png" 
            alt="Background Desktop" 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
        </motion.div>

        {/* Content Container */}
        <div className="relative z-10 flex-grow flex items-start md:items-center px-4 py-6 md:py-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-lg md:text-4xl font-black mb-3 md:mb-5 leading-tight text-stone-900 tracking-tight">
                  🚀 MÉTODO PANOS DE OURO: <span className="text-primary">O MAIOR PACK DE MODELOS E VENDAS DO BRASIL</span> (200+ PROJETOS PRONTOS)
                </h1>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mb-5 md:mb-6"
                >
                  <p className="text-sm md:text-base text-stone-700 leading-relaxed font-bold">
                    Pare de tentar adivinhar o que vende. Receba a máquina completa para transformar panos de prato comuns em peças de luxo que esgotam em minutos. Tudo mastigado: do fornecedor ao script de venda no WhatsApp.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex justify-center md:justify-start"
                >
                  <FlippingButton 
                    text1="QUERO MEU NEGÓCIO EM CASA" 
                    text2="QUERO FATURAR COM PANOS" 
                    className="text-base py-4 w-full max-w-sm" 
                    href={CHECKOUT_URL}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* What you receive */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SectionTitle>
            <span className="font-black">O QUE VOCÊ VAI RECEBER</span> <span className="font-normal">(ENTREGA IMEDIATA):</span>
          </SectionTitle>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {[
              { emoji: "✅", title: "200 RISCOS E MOLDES EXCLUSIVOS", desc: "A maior biblioteca do Brasil. Temas de Natal, Páscoa, Cozinha Moderna, Flores e Frutas. É só imprimir, riscar e brilhar." },
              { emoji: "🎥", title: "CURSO PRÁTICO \"MÃOS NA MASSA\"", desc: "Vídeo-aulas direto ao ponto. Aprenda o acabamento de luxo que permite você cobrar 3x mais caro que a concorrência." },
              { emoji: "📦", title: "O GUIA DO PANO PERFEITO", desc: "Qual tecido usar? Qual linha não desbota? Eu te dou o mapa das melhores matérias-primas." },
              { emoji: "📲", title: "PLATAFORMA VIP", desc: "Acesso por celular, tablet ou computador. Assista onde e quando quiser, para sempre." },
              { emoji: "💬", title: "COMUNIDADE \"MULHERES DE OURO\"", desc: "Onde as alunas postam suas vendas, tiram dúvidas e se motivam todos os dias." },
              { emoji: "♾️", title: "ACESSO VITALÍCIO + ATUALIZAÇÕES", desc: "Você paga uma vez e recebe novos modelos todos os meses sem pagar 1 centavo a mais." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ x: 8, scale: 1.01, backgroundColor: "#f8fafc" }}
                className="p-4 rounded-xl border border-primary/10 bg-white soft-shadow flex items-start gap-3 cursor-default transition-colors"
              >
                <div className="text-2xl shrink-0">{item.emoji}</div>
                <div>
                  <h3 className="text-sm font-black mb-1 text-stone-900 uppercase">{item.title}</h3>
                  <p className="text-stone-600 leading-relaxed text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center max-w-xl mx-auto"
          >
            <FlippingButton 
              text1="LIBERAR MEU ACESSO AGORA" 
              text2="QUERO OS 200 MODELOS" 
              className="text-sm py-3" 
              href={CHECKOUT_URL}
            />
          </motion.div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="py-12 px-4 bg-white relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <SectionTitle>
            🔥 <span className="font-black">BÔNUS EXPLOSIVOS</span> <span className="font-normal">(SÓ HOJE):</span>
          </SectionTitle>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col gap-3"
          >
            {[
              { image: "https://i.postimg.cc/Pq47Ztry/image.png", prefix: "BÔNUS 1:", title: "FORNECEDORES SECRETOS", desc: "Contatos de WhatsApp das fábricas que vendem sacaria e linhas a preço de custo." },
              { image: "https://i.postimg.cc/3rsH3xyr/image.png", prefix: "BÔNUS 2:", title: "VENDA NO ZAP EM 24H", desc: "Textos prontos para copiar e colar no seu status e ver os pedidos chegarem." },
              { image: "https://i.postimg.cc/pr84mK9y/image.png", prefix: "BÔNUS 3:", title: "CALCULADORA DE LUCRO", desc: "Ferramenta que faz a conta por você. Saiba quanto ganha em cada ponto." },
              { image: "https://i.postimg.cc/9FdsVt5L/ac305b996107b207b4a86e8238e7205c.jpg", prefix: "BÔNUS 4:", title: "PACK DE TAGS PREMIUM", desc: "Arquivos prontos para imprimir e valorizar sua marca na hora." },
            ].map((bonus, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-bg-soft border border-primary/10 items-center soft-shadow"
              >
                <div className="w-full sm:w-48 sm:h-48 md:w-72 md:h-72 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-primary/10 bg-white shadow-md">
                  <img 
                    src={bonus.image} 
                    alt={bonus.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg text-primary uppercase leading-tight mb-3">
                    <span className="font-normal">{bonus.prefix}</span> <span className="font-black">{bonus.title}</span>
                  </h3>
                  <p className="text-stone-600 text-base leading-relaxed mb-4">{bonus.desc}</p>
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block px-4 py-2 bg-emerald-500 text-white font-black text-sm rounded-lg shadow-lg shadow-emerald-200 uppercase tracking-widest"
                  >
                    🔥 HOJE: GRÁTIS
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 text-center">
            <Button className="max-w-md mx-auto text-sm py-3" href={CHECKOUT_URL}>QUERO TODOS OS BÔNUS</Button>
          </div>
        </div>
      </section>

      {/* Models Showcase */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <SectionTitle>
            🧵 <span className="font-black">OS MODELOS QUE VÃO TE FAZER GANHAR DINHEIRO:</span>
          </SectionTitle>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col gap-3"
          >
            {[
              { emoji: "🐓", title: "Galinhas e Vaquinhas Modernas", desc: "As campeãs de vendas em qualquer feira." },
              { emoji: "🍎", title: "Pomar de Luxo", desc: "Melancias, Maçãs e Morangos com efeito 3D simplificado." },
              { emoji: "🌸", title: "Jardim Encantado", desc: "Rosas, Copos de Leite e Girassóis que parecem pintura de tela." },
              { emoji: "🎅", title: "Mega Combo de Natal", desc: "Guirlandas, Papai Noel e Sinos (venda o ano todo em dezembro)." },
              { emoji: "🐰", title: "Páscoa Criativa", desc: "Coelhinhos e cenouras que encantam as mamães." },
              { emoji: "☕", title: "Cantinho do Café", desc: "Frases motivacionais e bules retrô (tendência em apartamentos)." },
              { emoji: "🧶", title: "Barrados de Crochê Express", desc: "O bico que valoriza o pano em 3x sem demorar horas." },
              { emoji: "🧺", title: "Kits de Cozinha Coordenados", desc: "Como montar jogos de 3 a 5 panos que vendem por R$ 150+." },
              { emoji: "🧼", title: "Técnica de Lavagem e Durabilidade", desc: "O segredo para o desenho não desbotar nunca." },
              { emoji: "💡", title: "E MUITO MAIS", desc: "Novos riscos e técnicas são adicionados constantemente na sua área de membros!" },
            ].map((model, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-bg-soft p-4 rounded-xl border border-primary/5 flex items-start gap-3 soft-shadow cursor-default"
              >
                <span className="text-2xl shrink-0">{model.emoji}</span>
                <div>
                  <h4 className="text-sm font-black mb-1 uppercase text-stone-900 leading-tight">{model.title}</h4>
                  <p className="text-stone-600 text-xs font-medium">{model.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center max-w-xl mx-auto"
          >
            <p className="text-primary font-bold text-base tracking-tight leading-tight">
              ⚠️ Além disso, você vai aprender a transformar qualquer desenho da internet em um molde perfeito para pano de prato.
            </p>
          </motion.div>

          <div className="mt-8 text-center">
            <Button className="max-w-md mx-auto text-sm py-3" href={CHECKOUT_URL}>QUERO APRENDER TUDO ISSO</Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <SectionTitle>
            <span className="font-black">Feedback de quem já Lucra com Panos de Pratos:</span>
          </SectionTitle>

          {/* Main Video Testimonial */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="mb-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/10 bg-black max-w-3xl mx-auto"
          >
            <CustomVideoPlayer src="https://www.dropbox.com/scl/fi/s8he63o86jkvdu9mmrzbk/video-depoimento.mp4?rlkey=bwd9mmyc3mj1aa3q122q4xlwc&st=uf69ybvm&raw=1" />
          </motion.div>

          {/* Image Carousel */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-6 md:overflow-x-auto md:snap-x md:snap-mandatory md:pb-8 no-scrollbar"
          >
            {[
              "https://i.postimg.cc/dVgN8BKf/1.png",
              "https://i.postimg.cc/Y214kq9h/2.png",
              "https://i.postimg.cc/TYfKPML7/3.png"
            ].map((img, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-primary/5 bg-stone-50 md:min-w-[320px] md:flex-1 md:snap-center"
              >
                <img 
                  src={img} 
                  alt={`Depoimento ${i + 1}`} 
                  className="w-full h-auto block"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Desktop Hint */}
          <div className="hidden md:block text-center mt-4 text-stone-400 text-xs font-bold uppercase tracking-widest animate-pulse">
            ← Arraste para o lado para ver mais →
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-4 bg-bg-soft text-center">
        <div className="max-w-2xl mx-auto">
          <SectionTitle>
            <span className="font-black">💎 Oferta Especial:</span> <span className="font-normal">Invista hoje. Colha para sempre.</span>
          </SectionTitle>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-white rounded-[24px] p-6 md:p-10 border-4 border-primary/10 shadow-xl relative overflow-hidden"
          >
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-primary text-white text-[9px] font-bold rounded-full uppercase tracking-widest">
                Acesso Vitalício Liberado
              </span>
            </div>

            <div className="space-y-2 mb-8 flex flex-col items-center">
              {[
                "Método Panos de Ouro Completo",
                "200 Moldes Prontos (A maior biblioteca do Brasil)",
                "O Mapa dos Fornecedores Secretos",
                "Script de Vendas \"Zap Rápido\"",
                "Calculadora de Lucro Automática",
                "Pack de Tags e Etiquetas Premium",
                "Comunidade VIP de Alunas",
                "Acesso Vitalício e Atualizações"
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="text-xs font-semibold text-stone-700 text-center"
                >
                  <span className="text-green-500 mr-2">✅</span>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="text-center border-t border-stone-100 pt-6">
              <div className="space-y-1 mb-4">
                <p className="text-stone-400 line-through text-xs font-bold opacity-50 uppercase tracking-tight">TODOS OS BÔNUS: R$ 248,00</p>
                <p className="text-stone-400 line-through text-xs font-bold opacity-50 uppercase tracking-tight">MÉTODO COMPLETO: R$ 97,00</p>
              </div>
              
              <p className="text-primary font-black text-lg uppercase tracking-tight mb-1">POR APENAS:</p>
              
              <motion.div 
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-4xl md:text-7xl font-black text-primary mb-4 tracking-tighter"
              >
                R$ 23,92
              </motion.div>

              <Button primary className="text-base md:text-lg py-4 mb-4 uppercase tracking-wider rounded-xl" href={CHECKOUT_URL}>
                GARANTIR MINHA VAGA AGORA →
              </Button>

              <div className="flex flex-col gap-1 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
                <p>Pix · Cartão</p>
                <p className="opacity-60">Pagamento Único · Acesso Imediato</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-12 px-4 bg-white border-y border-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-5xl mb-4"
          >
            ✅
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg md:text-2xl font-black mb-4 uppercase tracking-tight text-primary"
          >
            GARANTIA "LUCRO OU SEU DINHEIRO DE VOLTA"
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-stone-700 text-sm leading-relaxed mb-6 font-medium max-w-xl mx-auto"
          >
            Eu confio tanto no que eu entrego que te dou 15 dias de teste. Se você baixar os 200 modelos, ver as aulas e achar que não vai ganhar dinheiro com isso, eu te devolvo cada centavo.
          </motion.p>
          <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-tight">
            <ShieldCheck size={18} /> COMPRA 100% SEGURA
          </div>
        </div>
      </section>

      {/* Final FAQ/Support */}
      <section className="py-12 px-4 bg-bg-soft">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-5xl mb-4"
          >
            ❓
          </motion.div>
          <h2 className="text-lg md:text-2xl font-black mb-4 uppercase tracking-tight text-stone-900">AINDA COM DÚVIDA?</h2>
          
          <p className="text-sm text-stone-700 mb-8 font-medium leading-relaxed max-w-xl mx-auto">
            Se você vender <span className="font-bold text-primary underline decoration-primary/30 decoration-4 underline-offset-4">UM PANO</span> por semana, você paga o curso e ainda sobra lucro.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
            <Button className="py-3 text-sm" href={CHECKOUT_URL}>QUERO COMEÇAR AGORA</Button>
            <Button 
              href={CHECKOUT_URL}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white py-3 text-sm"
            >
              <MessageCircle size={18} /> SUPORTE WHATSAPP
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-stone-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-bold text-base uppercase tracking-tight mb-1">© MÉTODO PANOS DE OURO</p>
          <p className="text-stone-500 text-[10px]">Todos os Direitos Reservados</p>
        </div>
      </footer>
    </div>
  );
}
