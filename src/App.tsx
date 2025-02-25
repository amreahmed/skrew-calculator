import React, { useState, useEffect } from 'react';
import { Crown, Medal, Trophy, History, X } from 'lucide-react';

interface PlayerScore {
  name: string;
  rounds: number[];
  total: number;
  rank?: number;
}

interface GameHistory {
  id: string;
  date: string;
  players: PlayerScore[];
}

function App() {
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [players, setPlayers] = useState<PlayerScore[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [showPlayerSelection, setShowPlayerSelection] = useState(true);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const totalRounds = 5;

  useEffect(() => {
    const savedGame = localStorage.getItem('currentGame');
    const savedHistory = localStorage.getItem('gameHistory');
    
    if (savedGame) {
      const { players: savedPlayers, playerCount: savedCount } = JSON.parse(savedGame);
      setPlayers(savedPlayers);
      setPlayerCount(savedCount);
      setShowPlayerSelection(false);
    }
    
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (playerCount > 0) {
      localStorage.setItem('currentGame', JSON.stringify({
        players,
        playerCount
      }));
    }
  }, [players, playerCount]);

  useEffect(() => {
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
  }, [gameHistory]);

  const playerOptions = [
    'لعبين',
    'ثلث لعبين',
    'أربع لعبين',
    'خمس لعبين',
    'ستة لعبين',
    'سبعة لعبين',
    'ثمانية لعبين'
  ];

  const handlePlayerCountSelect = (count: number) => {
    const newPlayers = Array.from({ length: count }, () => ({
      name: '',
      rounds: Array(totalRounds).fill(0),
      total: 0
    }));
    setPlayers(newPlayers);
    setPlayerCount(count);
    setShowDropdown(false);
    setShowPlayerSelection(false);
    setCurrentRound(1);
  };

  const updateScore = (playerIndex: number, round: number, score: number) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        rounds: newPlayers[playerIndex].rounds.map((r, i) => i === round - 1 ? score : r)
      };
      
      newPlayers[playerIndex].total = newPlayers[playerIndex].rounds.reduce((acc, score, idx) => {
        return acc + (idx === totalRounds - 1 ? score * 2 : score);
      }, 0);

      // Sort by lowest score first
      const sortedPlayers = [...newPlayers].sort((a, b) => a.total - b.total);
      sortedPlayers.forEach((player, index) => {
        const originalIndex = newPlayers.findIndex(p => p.name === player.name && p.total === player.total);
        newPlayers[originalIndex].rank = index + 1;
      });
      
      return newPlayers;
    });
  };

  const updatePlayerName = (playerIndex: number, newName: string) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        name: newName
      };
      return newPlayers;
    });
  };

  const resetGame = () => {
    if (players.length > 0) {
      const newHistory: GameHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        players: [...players]
      };
      setGameHistory(prev => [newHistory, ...prev]);
    }
    
    setPlayers([]);
    setPlayerCount(0);
    setShowPlayerSelection(true);
    setCurrentRound(1);
    setShowRules(false);
    localStorage.removeItem('currentGame');
  };

  const clearHistory = () => {
    setGameHistory([]);
    localStorage.removeItem('gameHistory');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="inline-block ml-2" size={20} color="#FFD700" />;
      case 2:
        return <Medal className="inline-block ml-2" size={20} color="#C0C0C0" />;
      case 3:
        return <Trophy className="inline-block ml-2" size={20} color="#CD7F32" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Navigation */}
      <nav className="glass-panel p-2 md:p-4 mb-4 md:mb-8 flex justify-between md:justify-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
        <button 
          className="nav-item whitespace-nowrap flex items-center gap-1 text-xs md:text-base"
          onClick={() => setShowHistory(true)}
        >
          <History size={16} className="md:size-18" />
          السجل
        </button>
        <button 
          className="nav-item whitespace-nowrap text-xs md:text-base"
          onClick={() => setShowRules(true)}
        >
          القواعد
        </button>
        <a 
          href="http://instagram.com/amreahmed_" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="nav-item whitespace-nowrap text-xs md:text-base"
        >
          المطور
        </a>
        <button 
          className="nav-item whitespace-nowrap text-xs md:text-base"
          onClick={resetGame}
        >
          الرئيسية
        </button>
      </nav>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-white/20">
              <h2 className="text-xl text-white">قواعد اللعبه</h2>
              <button 
                className="text-white hover:text-red-400 transition-colors"
                onClick={() => setShowRules(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/_T7fGTqezGo"
                  title="قواعد اللعبه"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-white/20">
              <h2 className="text-xl text-white">سجل المباريات</h2>
              <button 
                className="text-white hover:text-red-400 transition-colors"
                onClick={() => setShowHistory(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              {gameHistory.length > 0 ? (
                <>
                  {gameHistory.map((game) => (
                    <div key={game.id} className="mb-6 last:mb-0 border-b border-white/10 pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80">{game.date}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:hidden">
                        {game.players
                          .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                          .map((player, idx) => (
                            <div key={idx} className="glass-panel p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white">{player.name || `لاعب ${idx + 1}`}</span>
                                <span className="flex items-center">
                                  {getRankIcon(player.rank || 0)}
                                  <span className={`
                                    ${player.rank === 1 ? 'text-yellow-400' : ''}
                                    ${player.rank === 2 ? 'text-gray-300' : ''}
                                    ${player.rank === 3 ? 'text-orange-400' : ''}
                                    text-white
                                  `}>
                                    {player.rank}
                                  </span>
                                </span>
                              </div>
                              <div className="text-white/80">النتيجة: {player.total}</div>
                            </div>
                          ))}
                      </div>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-right text-white/80 p-2">الاسم</th>
                              <th className="text-center text-white/80 p-2">النتيجة</th>
                              <th className="text-center text-white/80 p-2">المركز</th>
                            </tr>
                          </thead>
                          <tbody>
                            {game.players
                              .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                              .map((player, idx) => (
                                <tr key={idx}>
                                  <td className="text-white p-2">{player.name || `لاعب ${idx + 1}`}</td>
                                  <td className="text-white text-center p-2">{player.total}</td>
                                  <td className="text-center p-2">
                                    <span className="flex items-center justify-center">
                                      {getRankIcon(player.rank || 0)}
                                      <span className={`
                                        ${player.rank === 1 ? 'text-yellow-400' : ''}
                                        ${player.rank === 2 ? 'text-gray-300' : ''}
                                        ${player.rank === 3 ? 'text-orange-400' : ''}
                                        text-white
                                      `}>
                                        {player.rank}
                                      </span>
                                    </span>
                                  </td>
                                </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center mt-4">
                    <button 
                      className="purple-button"
                      onClick={clearHistory}
                    >
                      مسح السجل
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-white text-center py-8">لا يوجد سجل للمباريات السابقة</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Player Count Selection */}
      {showPlayerSelection && (
        <div className="glass-panel p-4 md:p-8 mb-4 md:mb-8">
          <h2 className="text-xl md:text-2xl text-white text-center mb-4 md:mb-6">كم عدد اللاعبين؟</h2>
          <div className="relative">
            <button 
              className="w-full bg-white/20 text-white p-3 rounded-lg text-right"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {playerCount ? playerOptions[playerCount - 2] : 'اختر عدد اللاعبين'}
            </button>
            
            {showDropdown && (
              <div className="absolute w-full mt-2 bg-white/20 backdrop-blur-md rounded-lg overflow-hidden z-10">
                {playerOptions.map((option, index) => (
                  <button
                    key={index}
                    className="w-full text-right p-3 text-white hover:bg-white/10 transition-all"
                    onClick={() => handlePlayerCountSelect(index + 2)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Score Table */}
      {playerCount > 0 && (
        <div className="glass-panel p-2 md:p-8">
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {players
              .sort((a, b) => (a.rank || 999) - (b.rank || 999))
              .map((player, playerIndex) => (
              <div key={playerIndex} className={`glass-panel p-4 ${player.rank === 1 ? 'bg-white/10' : ''}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => updatePlayerName(playerIndex, e.target.value)}
                      className="bg-white/5 text-white p-2 rounded-lg w-32 focus:outline-none focus:bg-white/10"
                      placeholder={`لاعب ${playerIndex + 1}`}
                    />
                    {player.rank && (
                      <div className="flex items-center gap-1">
                        {getRankIcon(player.rank)}
                        <span className={`
                          ${player.rank === 1 ? 'text-yellow-400' : ''}
                          ${player.rank === 2 ? 'text-gray-300' : ''}
                          ${player.rank === 3 ? 'text-orange-400' : ''}
                          text-white font-bold
                        `}>
                          {player.rank}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-white font-bold">
                    المجموع: {player.total}
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {player.rounds.map((score, roundIndex) => (
                    <div key={roundIndex} className="space-y-1">
                      <div className="text-white/60 text-center text-xs">
                        {roundIndex + 1}{roundIndex === totalRounds - 1 && <span className="text-yellow-400">*</span>}
                      </div>
                      <input
                        type="number"
                        value={score || ''}
                        onChange={(e) => updateScore(playerIndex, roundIndex + 1, parseInt(e.target.value) || 0)}
                        className="w-full bg-white/5 text-white text-center p-2 rounded focus:outline-none focus:bg-white/10"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="table-cell">الاسم</th>
                  {Array.from({ length: totalRounds }).map((_, index) => (
                    <th key={index} className="table-cell whitespace-nowrap">
                      جولة {index + 1}
                      {index === totalRounds - 1 && <span className="text-yellow-400 mr-1">(x2)</span>}
                    </th>
                  ))}
                  <th className="table-cell">المجموع</th>
                  <th className="table-cell">المركز</th>
                </tr>
              </thead>
              <tbody>
                {players
                  .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                  .map((player, playerIndex) => (
                  <tr key={playerIndex} className={player.rank === 1 ? 'bg-white/5' : ''}>
                    <td className="table-cell p-0">
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerName(playerIndex, e.target.value)}
                        className="w-full h-full bg-transparent text-white p-3 focus:outline-none"
                        placeholder={`لاعب ${playerIndex + 1}`}
                      />
                    </td>
                    {player.rounds.map((score, roundIndex) => (
                      <td key={roundIndex} className="table-cell p-0">
                        <input
                          type="number"
                          value={score || ''}
                          onChange={(e) => updateScore(playerIndex, roundIndex + 1, parseInt(e.target.value) || 0)}
                          className="w-full h-full bg-transparent text-white text-center p-3 focus:outline-none"
                          placeholder="0"
                        />
                      </td>
                    ))}
                    <td className="table-cell font-bold">{player.total}</td>
                    <td className="table-cell text-center">
                      {player.rank && (
                        <span className="flex items-center justify-center">
                          {getRankIcon(player.rank)}
                          <span className={`
                            ${player.rank === 1 ? 'text-yellow-400' : ''}
                            ${player.rank === 2 ? 'text-gray-300' : ''}
                            ${player.rank === 3 ? 'text-orange-400' : ''}
                          `}>
                            {player.rank}
                          </span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4 md:mt-8">
            <button 
              className="purple-button"
              onClick={resetGame}
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;