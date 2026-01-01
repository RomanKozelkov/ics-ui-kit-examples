import { Button } from 'ics-ui-kit'

export function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Button Demo</h1>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>

      <div>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  )
}
