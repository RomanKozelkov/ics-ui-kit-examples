import { useParams } from 'react-router'

export default function ComponentPage() {
  const { slug } = useParams()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Component: {slug}</h1>
    </div>
  )
}
