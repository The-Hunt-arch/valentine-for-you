import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import './App.css'

function App() {
  const [showGif, setShowGif] = useState(false)
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [cursorTrail, setCursorTrail] = useState([])
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Add cursor trail particle
      const particle = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now() + Math.random(),
      }
      setCursorTrail(prev => [...prev.slice(-20), particle])
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Remove old trail particles
    const interval = setInterval(() => {
      setCursorTrail(prev => prev.slice(-15))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const handleYesClick = () => {
    setShowGif(true)
    setShowConfetti(true)
    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000)
  }

  const handleNoHover = () => {
    // Trigger shake animation
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)

    // Adjust movement range for mobile
    const isMobile = window.innerWidth <= 768
    const moveRange = isMobile ? 40 : 120
    const verticalRange = isMobile ? 30 : 100

    // Move button to completely new random position
    const directions = [
      { x: moveRange, y: 0 },    // right
      { x: -moveRange, y: 0 },   // left
      { x: 0, y: verticalRange },    // down
      { x: 0, y: -verticalRange },   // up
      { x: moveRange * 0.8, y: verticalRange * 0.8 },   // diagonal down-right
      { x: -moveRange * 0.8, y: verticalRange * 0.8 },  // diagonal down-left
      { x: moveRange * 0.8, y: -verticalRange * 0.8 },  // diagonal up-right
      { x: -moveRange * 0.8, y: -verticalRange * 0.8 }, // diagonal up-left
    ]
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    
    // Add to current position with boundary constraints
    setNoButtonOffset(prev => {
      const newX = prev.x + randomDirection.x
      const newY = prev.y + randomDirection.y
      
      // Keep button within reasonable bounds (mobile-friendly)
      const maxOffset = isMobile ? 60 : 200
      const constrainedX = Math.max(-maxOffset, Math.min(maxOffset, newX))
      const constrainedY = Math.max(-maxOffset, Math.min(maxOffset, newY))
      
      return {
        x: constrainedX,
        y: constrainedY
      }
    })
  }

  const handleNoTouch = (e) => {
    // Prevent default to avoid click event
    e.preventDefault()
    // On mobile, move button away when touched
    handleNoHover()
  }

  return (
    <div className="app-container">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={500}
          gravity={0.3}
          colors={['#ff6b9d', '#ff8fab', '#ffa6c9', '#ffb6d9', '#ffc6e9', '#ff69b4', '#ff1493']}
        />
      )}
      
      {/* Cursor Trail */}
      {cursorTrail.map(particle => (
        <div
          key={particle.id}
          className="cursor-particle"
          style={{
            left: particle.x,
            top: particle.y,
          }}
        />
      ))}

      {/* Floating Hearts Background */}
      <div className="floating-hearts-bg">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`floating-heart floating-heart-${i}`}>
            {['❤️', '💕', '💖', '💗', '💝', '💓'][i % 6]}
          </div>
        ))}
      </div>

      {/* Fireworks */}
      {showGif && (
        <div className="fireworks-container">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`firework firework-${i}`}></div>
          ))}
        </div>
      )}

      <div className={`valentine-card ${isShaking ? 'shake-animation' : ''}`}>
        {/* Sparkle effects around card */}
        <div className="sparkles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
          ))}
        </div>

        <div className="hearts-decoration">
          <span className="heart">❤️</span>
          <span className="heart">💕</span>
          <span className="heart">💖</span>
          <span className="heart">💗</span>
          <span className="heart">💝</span>
        </div>
        
        <h1 className="valentine-text">
          Prachi, will you be my Valentine?
        </h1>

        {!showGif && (
          <div className="buttons-container">
            <button 
              className="yes-button" 
              onClick={handleYesClick}
            >
              YES! 💕
            </button>
            
            <button 
              className="no-button" 
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoTouch}
              style={{
                transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
                transition: 'transform 0.3s ease',
              }}
            >
              No 😂
            </button>
          </div>
        )}

        {showGif && (
          <div className="gif-container">
            <img 
              src="https://media.tenor.com/lQ7k8ool9FoAAAAM/happy-man-smiling-erik.gif" 
              alt="Love celebration" 
              className="celebration-gif"
            />
            <p className="success-message">I knew you'd say yes! 💖</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
