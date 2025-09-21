import { useState } from 'react';
import { wordPairs } from './wordPairs';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gamePhase, setGamePhase] = useState('setup');
  const [currentWordPair, setCurrentWordPair] = useState(null);
  const [playersWithRoles, setPlayersWithRoles] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [wordRevealed, setWordRevealed] = useState(false);

// Responsive styles
const styles = {
  app: {
    minHeight: '100vh',
    minWidth: '100vw', // Keep this for desktop
    backgroundColor: '#1a1a2e',
    color: '#eee',
    fontFamily: '"Comic Sans MS", "Chalkduster", "Bradley Hand", cursive',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 'clamp(15px, 4vw, 25px)',
    boxSizing: 'border-box',
    overflowX: 'hidden' // Prevent horizontal scroll on mobile
  },
  container: {
    width: '100%',
    maxWidth: '600px', // Fixed max width for desktop
    minWidth: '320px', // Minimum width for very small screens
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(15px, 3vw, 25px)',
    flex: 1,
    boxSizing: 'border-box'
  },
  header: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
    marginBottom: 'clamp(5px, 2vw, 15px)',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    lineHeight: '1.2'
  },
  subHeader: {
    textAlign: 'center',
    color: '#4ecdc4',
    fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
    marginBottom: 'clamp(5px, 2vw, 15px)',
    lineHeight: '1.3'
  },
  button: {
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: 'clamp(12px, 3vw, 18px) clamp(16px, 4vw, 24px)',
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    fontFamily: 'inherit',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: 'clamp(44px, 10vw, 54px)',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    display: 'block',
    boxSizing: 'border-box'
  },
  buttonSecondary: {
    backgroundColor: '#4ecdc4',
    color: '#1a1a2e'
  },
  buttonSuccess: {
    backgroundColor: '#45b7d1'
  },
  buttonDanger: {
    backgroundColor: '#f9ca24',
    color: '#1a1a2e'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(10px, 2.5vw, 15px)',
    alignItems: 'center',
    width: '100%'
  },
  input: {
    backgroundColor: '#16213e',
    border: '2px solid #4ecdc4',
    borderRadius: '8px',
    color: '#eee',
    padding: 'clamp(12px, 3vw, 16px)',
    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: 'clamp(10px, 2.5vw, 15px)'
  },
  card: {
    backgroundColor: '#16213e',
    border: '2px solid #4ecdc4',
    borderRadius: '12px',
    padding: 'clamp(16px, 4vw, 24px)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    width: '100%',
    boxSizing: 'border-box'
  },
  playerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  playerItem: {
    backgroundColor: '#0f4c75',
    padding: 'clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 18px)',
    margin: 'clamp(6px, 1.5vw, 10px) 0',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'clamp(8px, 2vw, 12px)'
  },
  wordDisplay: {
    fontSize: 'clamp(1.8rem, 6vw, 3rem)',
    fontWeight: 'bold',
    padding: 'clamp(20px, 5vw, 35px) clamp(15px, 4vw, 25px)',
    backgroundColor: '#ff6b6b',
    color: '#1a1a2e',
    borderRadius: '15px',
    textAlign: 'center',
    border: '3px solid #4ecdc4',
    wordBreak: 'break-word',
    lineHeight: '1.2',
    margin: 'clamp(15px, 3vw, 25px) 0'
  },
  instructions: {
    fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
    lineHeight: '1.5'
  },
  smallButton: {
    backgroundColor: '#e74c3c',
    padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 14px)',
    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    minWidth: 'clamp(70px, 15vw, 90px)',
    width: 'auto',
    minHeight: 'clamp(32px, 8vw, 40px)'
  }
};

  const addPlayer = () => {
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (name) => {
    setPlayers(players.filter(player => player !== name));
  };

  const startActualGame = () => {
    if (players.length >= 3) {
      const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
      setCurrentWordPair(randomPair);
      
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      const undercover = shuffledPlayers[0];
      
      const playersWithWords = shuffledPlayers.map(player => ({
        name: player,
        role: player === undercover ? 'undercover' : 'civilian',
        word: player === undercover ? randomPair.odd : randomPair.common
      }));
      
      setPlayersWithRoles(playersWithWords);
      setGamePhase('reveal');
      setCurrentPlayerIndex(0);
      setWordRevealed(false);
    } else {
      alert('Need at least 3 players to start!');
    }
  };

  const showWord = () => {
    setWordRevealed(true);
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < playersWithRoles.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setWordRevealed(false);
    } else {
      setGamePhase('playing');
    }
  };

  const newGame = () => {
    setGameStarted(false);
    setGamePhase('setup');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setWordRevealed(false);
    setCurrentWordPair(null);
    setPlayersWithRoles([]);
  };

  // Setup phase
  if (gameStarted && gamePhase === 'setup') {
    return (
      <div style={styles.app}>
        <div style={styles.container}>
          <h1 style={styles.header}>Add Players</h1>
          
          <div style={styles.card}>
            <input 
              type="text" 
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Enter player name..."
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              style={styles.input}
            />
            <button 
              onClick={addPlayer} 
              style={{...styles.button, ...styles.buttonSecondary}}
            >
              + Add Player
            </button>
          </div>

          <div style={styles.card}>
            <h3 style={{...styles.subHeader, margin: '0 0 15px 0'}}>
              Players ({players.length})
            </h3>
            {players.length === 0 ? (
              <p style={{textAlign: 'center', color: '#888', fontSize: '1.1rem'}}>
                No players added yet
              </p>
            ) : (
              <ul style={styles.playerList}>
                {players.map((player) => (
                  <li key={player} style={styles.playerItem}>
                    <span style={{fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', flexGrow: 1}}>
                      {player}
                    </span>
                    <button 
                      onClick={() => removePlayer(player)}
                      style={{...styles.button, ...styles.smallButton}}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={styles.buttonGroup}>
            <button 
              onClick={startActualGame}
              disabled={players.length < 3}
              style={{
                ...styles.button,
                ...(players.length >= 3 ? styles.buttonSuccess : {backgroundColor: '#666', cursor: 'not-allowed'}),
                fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
                padding: '16px 20px'
              }}
            >
              {players.length >= 3 ? '▶ Start Game' : `Need ${3 - players.length} more players`}
            </button>
            
            <button 
              onClick={() => setGameStarted(false)}
              style={{
                ...styles.button,
                backgroundColor: '#666',
                maxWidth: '200px'
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Word reveal phase
  if (gameStarted && gamePhase === 'reveal') {
    const currentPlayer = playersWithRoles[currentPlayerIndex];
    
    return (
      <div style={styles.app}>
        <div style={styles.container}>
          <h1 style={styles.header}>Secret Word Reveal</h1>
          <h2 style={styles.subHeader}>
            Player {currentPlayerIndex + 1} of {playersWithRoles.length}
          </h2>
          
          {!wordRevealed ? (
            <>
              <div style={styles.card}>
                <p style={{ 
                  fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', 
                  marginBottom: '15px', 
                  color: '#ff6b6b',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {currentPlayer.name}, it's your turn!
                </p>
                <p style={{ 
                  marginBottom: '20px', 
                  color: '#888', 
                  fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                  textAlign: 'center'
                }}>
                  Others, please look away! 👁️
                </p>
              </div>
              
              <div style={styles.buttonGroup}>
                <button 
                  onClick={showWord}
                  style={{
                    ...styles.button,
                    ...styles.buttonSuccess,
                    fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
                    padding: '18px 20px'
                  }}
                >
                  👁️ Tap to See Your Word
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ 
                fontSize: 'clamp(1.1rem, 2.5vw, 1.2rem)', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <strong>{currentPlayer.name}</strong>, your word is:
              </p>
              
              <div style={styles.wordDisplay}>
                {currentPlayer.word}
              </div>
              
              <p style={{ 
                fontSize: 'clamp(0.9rem, 2.2vw, 1rem)', 
                color: '#888', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Remember this word! You'll describe it to the group.
              </p>
              
              <div style={styles.buttonGroup}>
                <button 
                  onClick={nextPlayer}
                  style={{
                    ...styles.button,
                    ...styles.buttonSuccess,
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.2rem)',
                    padding: '16px 20px'
                  }}
                >
                  {currentPlayerIndex < playersWithRoles.length - 1 
                    ? `▶ Next: ${playersWithRoles[currentPlayerIndex + 1].name}`
                    : '▶ Start Playing!'
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Playing phase
  if (gameStarted && gamePhase === 'playing') {
    return (
      <div style={styles.app}>
        <div style={styles.container}>
          <h1 style={styles.header}>Game Time!</h1>
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.2rem)', 
            marginBottom: '20px', 
            textAlign: 'center' 
          }}>
            Everyone now knows their secret word.
          </p>
          
          <div style={styles.card}>
            <h3 style={{color: '#4ecdc4', marginBottom: '15px', fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)'}}>
              How to Play:
            </h3>
            <ol style={{...styles.instructions, paddingLeft: '20px'}}>
              <li style={{marginBottom: '10px'}}>
                <strong>Give clues:</strong> Each person describes their word with a short clue
              </li>
              <li style={{marginBottom: '10px'}}>
                <strong>Discuss:</strong> Talk about which clues seem different
              </li>
              <li style={{marginBottom: '10px'}}>
                <strong>Vote:</strong> Point to who you think is the undercover
              </li>
              <li>
                <strong>Ready?</strong> Click "Reveal Results" to see who was undercover!
              </li>
            </ol>
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => setGamePhase('results')}
              style={{
                ...styles.button,
                ...styles.buttonDanger,
                fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
                padding: '18px 20px'
              }}
            >
              ★ Reveal Results
            </button>
            
            <button 
              onClick={newGame}
              style={{
                ...styles.button,
                backgroundColor: '#666',
                maxWidth: '200px'
              }}
            >
              ↻ New Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results phase
  if (gameStarted && gamePhase === 'results') {
    const undercover = playersWithRoles.find(p => p.role === 'undercover');
    const civilians = playersWithRoles.filter(p => p.role === 'civilian');
    
    return (
      <div style={styles.app}>
        <div style={styles.container}>
          <h1 style={styles.header}>Game Results!</h1>
          
          <div style={{
            ...styles.card,
            backgroundColor: '#8b2635',
            borderColor: '#ff6b6b'
          }}>
            <h2 style={{ 
              color: '#ff6b6b', 
              textAlign: 'center', 
              marginBottom: '15px',
              fontSize: 'clamp(1.2rem, 3vw, 1.4rem)'
            }}>
              The Undercover Player:
            </h2>
            <p style={{ 
              fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', 
              fontWeight: 'bold', 
              textAlign: 'center',
              marginBottom: '10px'
            }}>
              ★ {undercover.name}
            </p>
            <p style={{ 
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
              textAlign: 'center' 
            }}>
              Had the word: <strong>"{undercover.word}"</strong>
            </p>
          </div>
          
          <div style={{
            ...styles.card,
            backgroundColor: '#1e3d59',
            borderColor: '#4ecdc4'
          }}>
            <h2 style={{ 
              color: '#4ecdc4', 
              textAlign: 'center', 
              marginBottom: '15px',
              fontSize: 'clamp(1.2rem, 3vw, 1.4rem)'
            }}>
              The Civilians:
            </h2>
            {civilians.map((player) => (
              <p key={player.name} style={{ 
                fontSize: 'clamp(1rem, 2.2vw, 1.1rem)', 
                margin: '8px 0', 
                textAlign: 'center' 
              }}>
                ◆ {player.name} - had "{player.word}"
              </p>
            ))}
          </div>
          
          <p style={{ 
            fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)', 
            color: '#888', 
            textAlign: 'center', 
            margin: '20px 0' 
          }}>
            Word pair: <strong>{currentWordPair.common}</strong> vs <strong>{currentWordPair.odd}</strong>
          </p>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={newGame}
              style={{
                ...styles.button,
                ...styles.buttonSuccess,
                fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
                padding: '18px 20px'
              }}
            >
              ▶ Play Again!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Home screen
  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <h1 style={{...styles.header, fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', marginBottom: '20px'}}>
          UNDERCOVER
        </h1>
        
        <div style={styles.card}>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.8vw, 1.2rem)', 
            textAlign: 'center', 
            marginBottom: '15px'
          }}>
            A fun word guessing game for friends
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.1rem)', 
            textAlign: 'center', 
            color: '#888',
            lineHeight: '1.4'
          }}>
            Most players get one word, one player gets a similar word. Find the undercover!
          </p>
        </div>
        
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => {
              setGameStarted(true);
              setGamePhase('setup');
            }}
            style={{
              ...styles.button,
              ...styles.buttonSuccess,
              fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
              padding: '20px'
            }}
          >
            ▶ Start Game
          </button>
        </div>
      </div>
    </div>
    );
}

export default App;
