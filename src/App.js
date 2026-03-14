import React, { useState, useEffect, useCallback } from 'react'; 
import confetti from 'canvas-confetti'; 

const App = () => { 
  // State'leri string tutmak input alanlarındaki "silince başka sayıya zıplama" sorununu çözer
  const [count, setCount] = useState(0); 
  const [step, setStep] = useState("2"); 
  const [target, setTarget] = useState("20"); 
  const [stars, setStars] = useState(0); 
  const [startValue, setStartValue] = useState("0"); 

  // String olan state değerlerini hesaplamalarda kullanmak üzere sayıya dönüştürüyoruz
  const currentStep = parseInt(step) || 1;
  const currentTarget = parseInt(target) || 1; // Sıfıra bölünme hatasını önler
  const currentStart = parseInt(startValue) || 0;

  // Seslendirme Fonksiyonu
  const speak = useCallback((text) => { 
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Önceki yarım kalan sesi durdur (hızlı tıklamalar için)
      const utterance = new SpeechSynthesisUtterance(text.toString()); 
      utterance.lang = 'tr-TR'; 
      window.speechSynthesis.speak(utterance); 
    }
  }, []); 

  // Hedefe Ulaşma Efekti
  useEffect(() => { 
    if (count !== 0 && count === currentTarget) { 
      setStars(prev => {
        const nextStars = prev + 1;
        confetti({ 
          particleCount: 150, 
          spread: 70, 
          origin: { y: 0.6 }, 
          colors: ['#ffd700', '#ffae00', '#ffffff'] 
        }); 
        speak(`Harika! Hedefe ulaştın ve bir yıldız kazandın! Toplam ${nextStars} yıldızın oldu.`); 
        return nextStars;
      });
    } 
  }, [count, currentTarget, speak]); 

  // Başlangıç değerini değiştirme
  const handleStartValueChange = (val) => { 
    setStartValue(val); 
    const num = parseInt(val);
    setCount(!isNaN(num) ? num : 0); 
  }; 

  const handleIncrement = () => { 
    const nextValue = count + currentStep; 
    setCount(nextValue); 
    speak(nextValue); 
  }; 

  const handleDecrement = () => { 
    // Sıfırın (veya başlangıç değerinin) altına inmesini engelliyoruz
    const nextValue = count - currentStep >= 0 ? count - currentStep : 0; 
    setCount(nextValue); 
    speak(nextValue); 
  }; 

  const handleReset = () => { 
    setCount(currentStart); 
    speak(`${currentStart} sayısından tekrar başlıyoruz!`); 
  }; 

  // Bir sayının mevcut ritmik sayma dizisinde olup olmadığını kontrol eder
  const isSequenceNumber = (num) => {
    return num >= currentStart && (num - currentStart) % currentStep === 0;
  };

  return ( 
    <div style={styles.container}> 
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
          <input type="number" value={step} onChange={(e) => setStep(e.target.value)} style={styles.input} /> 
        </div> 
        <div style={styles.inputBox}> 
          <label style={styles.label}>Hedef</label> 
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} style={styles.input} /> 
        </div> 
      </div> 

      <div style={styles.mainDisplay}> 
        <div style={styles.countText}>{count}</div> 
        <div style={styles.progressBarContainer}> 
          <div style={{...styles.progressBar, width: `${Math.min((count/currentTarget)*100, 100)}%`}}></div> 
        </div> 
      </div> 

      <div style={styles.visualizer}> 
        {Array.from({ length: Math.min(count, 100) }).map((_, i) => {
          const num = i + 1;
          const isSeq = isSequenceNumber(num);
          return ( 
            <span key={i} style={{ 
              ...styles.numberBox, 
              backgroundColor: isSeq ? '#2ecc71' : '#3498db', 
              transform: isSeq ? 'scale(1.1)' : 'scale(0.0)',
            }}> 
              {num} 
            </span> 
          );
        })} 
      </div> 

      <div style={styles.buttonGroup}> 
        <button onClick={handleDecrement} style={{...styles.btn, backgroundColor: '#ff1900'}}>-{currentStep}</button> 
        <button onClick={handleReset} style={{...styles.btn, backgroundColor: '#fff', color: '#000', width: 'auto'}}>🔄</button> 
        <button onClick={handleIncrement} style={{...styles.btn, backgroundColor: '#2ecc71'}}>+{currentStep}</button> 
      </div> 
    </div> 
  ); 
}; 

const styles = { 
  logoWrapper: { display: 'block', textAlign: 'center', width: '100%', textDecoration: 'none' }, 
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw', height: '100vh', padding: '10px', backgroundColor: '#eef2f3', fontFamily: 'sans-serif', overflowY: 'auto' }, 
  logo: { width: 'min(180px, 40%)', height: 'auto', marginBottom: '10px', cursor: 'pointer', transition: 'opacity 0.2s', borderRadius: '10px' }, 
  starScore: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }, 
  title: { fontSize: 'clamp(1.2rem, 4vw, 2rem)', margin: '10px 0', color: '#2c3e50' }, 
  configRow: { display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap', justifyContent: 'center' }, 
  inputBox: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, 
  label: { fontSize: '12px', color: '#7f8c8d' }, 
  input: { width: '60px', padding: '8px', borderRadius: '10px', border: '2px solid #3498db', textAlign: 'center' }, 
  mainDisplay: { backgroundColor: 'white', padding: '20px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: 'min(300px, 80%)', textAlign: 'center' }, 
  countText: { fontSize: 'clamp(60px, 15vw, 100px)', fontWeight: '900', color: '#3498db' }, 
  progressBarContainer: { width: '100%', height: '8px', backgroundColor: '#ecf0f1', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }, 
  progressBar: { height: '100%', backgroundColor: '#2ecc71', transition: 'width 0.3s' }, 
  visualizer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', margin: '20px 0', maxWidth: '90%', flex: 1, overflowY: 'auto', padding: '10px' }, 
  numberBox: { width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold' }, 
  buttonGroup: { display: 'flex', gap: '15px', paddingBottom: '20px', width: '100%', justifyContent: 'center' }, 
  btn: { flex: 1, maxWidth: '120px', padding: '15px', fontSize: '20px', cursor: 'pointer', color: 'white', border: 'none', borderRadius: '15px', boxShadow: '0 4px rgba(0,0,0,0.2)', fontWeight: 'bold' } 
}; 

export default App;