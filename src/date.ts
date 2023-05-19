// Parses colorhunt's textual time ago and converts it to ms.
function timeAgoToMs(text: string): number {
  const second = 1000
  const minute = 60 * second
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 12 * month

  if (text === 'Yesterday') {
    return day
  }

  const number = parseInt(text.split(' ')[0])
  const unit = text.split(' ')[1]

  switch (unit) {
    case 'millisecond':
    case 'milliseconds':
      return number * 1
    case 'second':
    case 'seconds':
      return number * second
    case 'minute':
    case 'minutes':
      return number * minute
    case 'hour':
    case 'hours':
      return number * hour
    case 'day':
    case 'days':
      return number * day
    case 'week':
    case 'weeks':
      return number * week
    case 'month':
    case 'months':
      return number * month
    case 'year':
    case 'years':
      return number * year
    default:
      return 1 * year
  }
}

function parseDate(text: string) {
  const ms = timeAgoToMs(text)
  return new Date(Date.now() - ms)
}

export { parseDate }
