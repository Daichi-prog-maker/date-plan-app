// 古い本・ノート風スタイルヘルパー
export const ghibliStyles = {
  card: {
    background: '#FFF8E7',
    border: '2px solid #D4C4A8',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(92, 74, 58, 0.1)',
  },
  button: {
    background: '#FFF59D',
    border: '2px solid #F9A825',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(249, 168, 37, 0.3)',
    color: '#5C4A3A',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonPink: {
    background: '#FFD1DC',
    border: '2px solid #F48FB1',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(244, 143, 177, 0.3)',
    color: '#5C4A3A',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  input: {
    background: '#FFFFFF',
    border: '2px solid #D4C4A8',
    borderRadius: '8px',
    padding: '10px 15px',
    fontSize: '14px',
    color: '#5C4A3A',
    boxShadow: 'inset 0 1px 3px rgba(92, 74, 58, 0.1)',
  },
  tag: {
    background: '#FFFACD',
    border: '1px solid #F9A825',
    borderRadius: '4px',
    padding: '4px 12px',
    fontSize: '12px',
    color: '#5C4A3A',
  },
  header: {
    background: '#FFF8E7',
    borderBottom: '2px solid #D4C4A8',
    boxShadow: '0 2px 4px rgba(92, 74, 58, 0.1)',
  },
  searchBox: {
    background: '#FFFFFF',
    border: '2px solid #D4C4A8',
    borderRadius: '20px',
    boxShadow: '0 2px 4px rgba(92, 74, 58, 0.1)',
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
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#5C4A3A'
  }
}
