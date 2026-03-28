import { useParams } from 'react-router'

export default function CategoryPage() {
  const { slug } = useParams()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Category: {slug}</h1>
    </div>
  )
}
