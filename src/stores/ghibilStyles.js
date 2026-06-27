// ジブリ風スタイルヘルパー
export const ghibliStyles = {
  card: {
    background: 'linear-gradient(to bottom, #FAF8F3 0%, #F5F1E8 100%)',
    border: '3px solid #8B7355',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(139, 115, 85, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
  },
  button: {
    background: 'linear-gradient(to bottom, #C9A87C 0%, #A88B6B 100%)',
    border: '2px solid #8B7355',
    borderRadius: '20px',
    boxShadow: '0 3px 6px rgba(139, 115, 85, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    color: '#4A3F35',
    fontWeight: '600',
    textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
  },
  buttonPink: {
    background: 'linear-gradient(to bottom, #E8B5B5 0%, #D19A9A 100%)',
    border: '2px solid #C17C74',
    borderRadius: '20px',
    boxShadow: '0 3px 6px rgba(193, 124, 116, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    color: '#4A3F35',
    fontWeight: '600',
    textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
  },
  input: {
    background: '#FFFFFF',
    border: '2px solid #C9A87C',
    borderRadius: '12px',
    padding: '10px 15px',
    fontSize: '14px',
    color: '#4A3F35',
    boxShadow: 'inset 0 2px 4px rgba(139, 115, 85, 0.1)',
  },
  tag: {
    background: 'linear-gradient(to bottom, #F5E6D3 0%, #E8DCC8 100%)',
    border: '1px solid #C9A87C',
    borderRadius: '12px',
    padding: '4px 12px',
    fontSize: '12px',
    color: '#4A3F35',
  },
  header: {
    background: 'linear-gradient(to bottom, #FAF8F3 0%, #F5F1E8 100%)',
    borderBottom: '3px solid #8B7355',
    boxShadow: '0 2px 8px rgba(139, 115, 85, 0.15)',
  },
  searchBox: {
    background: '#FFFFFF',
    border: '3px solid #8B7355',
    borderRadius: '25px',
    boxShadow: '0 3px 6px rgba(139, 115, 85, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  }
}
// スタイルをマージするヘルパー
export const mergeGhibliStyles = (baseStyle, customStyles = {}) => ({
  ...baseStyle,
  ...customStyles
})

// よく使うスタイルの組み合わせ
export const commonStyles = {
  searchBar: {
    ...ghibliStyles.searchBox,
    width: '100%',
    height: '48px',
    paddingLeft: '40px',
    boxSizing: 'border-box'
  },
  iconButton: {
    ...ghibliStyles.buttonPink,
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  filterButton: {
    ...ghibliStyles.button,
    padding: '8px 16px'
  }
}

