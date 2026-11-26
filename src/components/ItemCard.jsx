import { Link } from 'react-router-dom'

function ItemCard({ item, children }) {
  return (
    <div className="card">
      <h3>
        <Link to={'/items/' + item.id}>{item.title}</Link>
      </h3>
      <p className="card-author">{item.author}, {item.year}</p>
      {item.owner_name && <p className="card-owner">Добавил: {item.owner_name}</p>}
      {children && <div className="card-actions">{children}</div>}
    </div>
  )
}

export default ItemCard
