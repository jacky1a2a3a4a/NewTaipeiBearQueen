// React
import { useState } from 'react';

// Icons
import { MdHome, MdFavorite } from 'react-icons/md';

// 元件屬性類型定義
type AppProps = {
  title?: string;
};

// 主應用程式元件
const App = ({ title = '新北熊王' }: AppProps) => {
  // Constants and Configuration
  const [count, setCount] = useState(0);

  // Event Handler Functions
  // 處理計數器增加
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  // 處理計數器重置
  const handleReset = () => {
    setCount(0);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>
        <MdHome style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        {title}
      </h1>

      <div style={{ marginTop: '20px' }}>
        <p>計數器: {count}</p>
        <button
          onClick={handleIncrement}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          增加
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          重置
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <MdFavorite style={{ color: 'red', fontSize: '24px' }} />
        <span style={{ marginLeft: '8px' }}>歡迎使用 React！</span>
      </div>
    </div>
  );
};

export default App;
