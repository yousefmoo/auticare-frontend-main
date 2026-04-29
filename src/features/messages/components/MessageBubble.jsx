import PropTypes from 'prop-types'

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-[1.5rem] px-4 py-3 text-sm shadow-sm ${
          isOwn
            ? 'bg-sky-600 text-white'
            : 'border border-[var(--border)] bg-[var(--card)] text-[var(--ink)]'
        }`}
      >
        <p className="leading-6">{message.text}</p>
        <p className={`mt-2 text-[11px] ${isOwn ? 'text-sky-100' : 'text-[var(--muted-2)]'}`}>{message.time}</p>
      </div>
    </div>
  )
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  isOwn: PropTypes.bool.isRequired,
}
