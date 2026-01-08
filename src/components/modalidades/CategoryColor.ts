export default function getCategoryGradient(tipo?: string) {
  switch (tipo?.toLowerCase()) {
    case 'equipe':
    case 'revezamento':
      return 'from-blue-500 to-blue-600';
    case 'individual':
      return 'from-green-500 to-green-600';
    case 'dupla':
      return 'from-purple-500 to-purple-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
}
