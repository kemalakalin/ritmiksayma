import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const App = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(2);
  const [target, setTarget] = useState(20);
  const [stars, setStars] = useState(0);
  const [startValue, setStartValue] = useState(0);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (count !== 0 && count === target) {
      setStars(prev => prev + 1);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ffae00', '#ffffff']
      });
      speak(`Harika! Hedefe ulaştın ve bir yıldız kazandın! Toplam ${stars + 1} yıldızın oldu.`);
    }
  }, [count, target]);

  const handleStartValueChange = (val) => {
    const num = parseInt(val) || 0;
    setStartValue(num);
    setCount(num);
  };

  const handleIncrement = () => {
    const nextValue = count + step;
    setCount(nextValue);
    speak(nextValue);
  };

  const handleDecrement = () => {
    const nextValue = count - step >= 0 ? count - step : 0;
    setCount(nextValue);
    speak(nextValue);
  };

  const handleReset = () => {
    setCount(startValue);
    speak(`${startValue} sayısından tekrar başlıyoruz!`);
  };

  return (
    <div style={styles.container}>
      {/* Scrollbar Gizleme İçin Global Stil Enjeksiyonu */}
      <style>{`
        body { margin: 0; overflow: hidden; }
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; box-sizing: border-box; }
      `}</style>
<a 
  href="https://akalinpsikoloji.com.tr" 
  target="_blank" 
  rel="noopener noreferrer" 
  style={styles.logoWrapper}
>
  <img 
    src="https://akalinpsikoloji.com.tr/panel/uploads/settings_v/1280x720/logom.PNG" 
    alt="Logo" 
    style={styles.logo} 
  />
</a>

      <div style={styles.starScore}>
        {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
          <span key={i}>⭐</span>
        ))}
        <span style={{ marginLeft: '10px' }}>{stars} Yıldız</span>
      </div>

      <h1 style={styles.title}>Ritmik Sayma Öğreniyorum🌟</h1>

      <div style={styles.configRow}>
        <div style={styles.inputBox}>
          <label style={styles.label}>Başlangıç</label>
          <input type="number" value={startValue} onChange={(e) => handleStartValueChange(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.inputBox}>
          <label style={styles.label}>Artış</label>
          <input type="number" value={step} onChange={(e) => setStep(parseInt(e.target.value) || 1)} style={styles.input} />
        </div>
        <div style={styles.inputBox}>
          <label style={styles.label}>Hedef</label>
          <input type="number" value={target} onChange={(e) => setTarget(parseInt(e.target.value) || 100)} style={styles.input} />
        </div>
      </div>

      <div style={styles.mainDisplay}>
        <div style={styles.countText}>{count}</div>
        <div style={styles.progressBarContainer}>
          <div style={{...styles.progressBar, width: `${Math.min((count/target)*100, 100)}%`}}></div>
        </div>
      </div>

      <div style={styles.visualizer}>
        {Array.from({ length: Math.min(count, 100) }).map((_, i) => (
          <span key={i} style={{
            ...styles.numberBox,
            backgroundColor: (i + 1) % step === 0 ? '#2ecc71' : '#3498db',
            transform: (i + 1) % step === 0 ? 'scale(1.1)' : 'scale(0.0)',
          }}>
            {i + 1}
          </span>
        ))}
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={handleDecrement} style={{...styles.btn, backgroundColor: '#ff1900'}}>-{step}</button>
        <button onClick={handleReset} style={{...styles.btn, backgroundColor: '#fff', color: '#000', width: 'auto'}}>🔄</button>
        <button onClick={handleIncrement} style={{...styles.btn, backgroundColor: '#2ecc71'}}>+{step}</button>
      </div>
    </div>
  );
};

const styles = {
  logoWrapper: {
    display: 'block',       // Tüm satırı kaplamasını sağlar
    textAlign: 'center',    // İçindeki görseli yatayda ortalar
    width: '100%',          // Genişliği tam yapar
    textDecoration: 'none'  // Link alt çizgisini kaldırır
  },
  container: { 
    display: 'flex', flexDirection: 'column', alignItems: 'center', 
    width: '100vw', height: '100vh', padding: '10px',
    backgroundColor: '#eef2f3', fontFamily: 'sans-serif', overflowY: 'auto' 
  },
  logo: { 
  width: 'min(180px, 40%)', 
  height: 'auto', 
  marginBottom: '10px',
  cursor: 'pointer', // Fare ile üzerine gelince el işareti çıkar
  transition: 'opacity 0.2s', // Hafif bir geçiş efekti
},
  starScore: { 
    position: 'absolute', top: '10px', right: '10px', 
    backgroundColor: '#fff', padding: '5px 15px', borderRadius: '20px', 
    fontSize: '0.9rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
  },
  title: { fontSize: 'clamp(1.2rem, 4vw, 2rem)', margin: '10px 0', color: '#2c3e50' },
  configRow: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap', justifyContent: 'center' },
  inputBox: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  label: { fontSize: '12px', color: '#7f8c8d' },
  input: { width: '60px', padding: '8px', borderRadius: '10px', border: '2px solid #3498db', textAlign: 'center' },
  mainDisplay: { 
    backgroundColor: 'white', padding: '20px', borderRadius: '30px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: 'min(300px, 80%)', textAlign: 'center' 
  },
  countText: { fontSize: 'clamp(60px, 15vw, 100px)', fontWeight: '900', color: '#3498db' },
  progressBarContainer: { width: '100%', height: '8px', backgroundColor: '#ecf0f1', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#2ecc71', transition: 'width 0.3s' },
  visualizer: { 
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', 
    margin: '20px 0', maxWidth: '90%', flex: 1, overflowY: 'auto', padding: '10px' 
  },
  numberBox: { 
    width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold' 
  },
  buttonGroup: { display: 'flex', gap: '15px', paddingBottom: '20px', width: '100%', justifyContent: 'center' },
  btn: { 
    flex: 1, maxWidth: '120px', padding: '15px', fontSize: '20px', 
    cursor: 'pointer', color: 'white', border: 'none', borderRadius: '15px', 
    boxShadow: '0 4px rgba(0,0,0,0.2)', fontWeight: 'bold' 
  }
};

export default App;