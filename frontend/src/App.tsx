import { useEffect, useState } from 'react'
import './App.css'

type ApiStatus = {
  service: string
  status: string
  environment: string
  checkedAt: string
}

type Product = {
  id: number
  name: string
  category: string
  price: number
  inStock: boolean
}

type ProductForm = Omit<Product, 'id'>

const emptyForm: ProductForm = { name: '', category: '', price: 0, inStock: true }

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const checkApi = async () => {
    try {
      setError('')
      const response = await fetch('/api/status')
      if (!response.ok) throw new Error('The API returned an error.')
      setApiStatus(await response.json())
    } catch {
      setError('Backend unavailable. Start the API on port 5151.')
    }
  }

  const loadProducts = async () => {
    const response = await fetch('/api/products')
    if (!response.ok) throw new Error('Could not load products.')
    setProducts(await response.json())
  }

  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const url = editingId === null ? '/api/products' : `/api/products/${editingId}`
    const method = editingId === null ? 'POST' : 'PUT'
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!response.ok) {
      setError('Could not save the product.')
      return
    }
    setForm(emptyForm)
    setEditingId(null)
    await loadProducts()
  }

  const deleteProduct = async (id: number) => {
    if (!window.confirm('Delete this product?')) return
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      setError('Could not delete the product.')
      return
    }
    await loadProducts()
  }

  useEffect(() => {
    void checkApi()
    void loadProducts().catch(() => setError('Backend unavailable. Start the API on port 5151.'))
  }, [])

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-mark">C</div>
        <div>
          <p className="eyebrow">LOCAL SERVICE CONSOLE</p>
          <h1>Catalog control room</h1>
        </div>
        <span className="environment">LOCAL / DEV</span>
      </header>

      <section className="intro">
        <p className="eyebrow">MICROSERVICE STARTER</p>
        <h2>One small system,<br />ready to grow.</h2>
        <p className="lede">A practical frontend and backend baseline for testing service boundaries before AWS deployment.</p>
      </section>

      <section className="status-grid" aria-label="Service status">
        <article className="status-card primary-card">
          <div className="card-heading"><span className="pulse" /> Backend API</div>
          <p className="service-name">catalog-api</p>
          <div className={`status-line ${apiStatus ? 'online' : 'offline'}`}>
            <span className="status-dot" /> {apiStatus ? 'Healthy' : error ? 'Unavailable' : 'Checking'}
          </div>
          <p className="muted">ASP.NET Core · .NET 9</p>
          <button type="button" onClick={() => void checkApi()}>Check connection <span>↗</span></button>
        </article>

        <article className="status-card detail-card">
          <p className="eyebrow">RESPONSE</p>
          {apiStatus ? (
            <dl>
              <div><dt>Environment</dt><dd>{apiStatus.environment}</dd></div>
              <div><dt>Endpoint</dt><dd>/api/status</dd></div>
              <div><dt>Checked</dt><dd>{new Date(apiStatus.checkedAt).toLocaleTimeString()}</dd></div>
            </dl>
          ) : <p className="muted">{error || 'Waiting for the backend response...'}</p>}
        </article>
      </section>

      <section className="catalog-section" aria-label="Product catalog">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SQLITE CATALOG</p>
            <h3>Products <span>{products.length.toString().padStart(2, '0')}</span></h3>
          </div>
          <p className="muted">Changes made here are saved through the backend API.</p>
        </div>

        <form className="product-form" onSubmit={(event) => void saveProduct(event)}>
          <input required placeholder="Product name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input required placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
          <input required min="0" step="0.01" type="number" placeholder="Price" value={form.price || ''} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} />
          <label className="stock-check"><input type="checkbox" checked={form.inStock} onChange={(event) => setForm({ ...form, inStock: event.target.checked })} /> In stock</label>
          <button type="submit" className="save-button">{editingId === null ? 'Add product' : 'Save changes'}</button>
          {editingId !== null && <button type="button" className="cancel-button" onClick={() => { setForm(emptyForm); setEditingId(null) }}>Cancel</button>}
        </form>

        <div className="product-list">
          {products.map((product) => (
            <article className="product-row" key={product.id}>
              <div><strong>{product.name}</strong><span>{product.category}</span></div>
              <div className="product-price">${product.price.toFixed(2)}</div>
              <div className={product.inStock ? 'stock available' : 'stock'}>{product.inStock ? 'Available' : 'Out of stock'}</div>
              <div className="row-actions"><button type="button" onClick={() => { setEditingId(product.id); setForm({ name: product.name, category: product.category, price: product.price, inStock: product.inStock }) }}>Edit</button><button type="button" onClick={() => void deleteProduct(product.id)}>Delete</button></div>
            </article>
          ))}
        </div>
      </section>

      <footer><span>FRONTEND</span> React + TypeScript <i /> <span>BACKEND</span> ASP.NET Core Web API</footer>
    </main>
  )
}

export default App
