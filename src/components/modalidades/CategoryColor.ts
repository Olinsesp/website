export default function getCategoryGradient(categoria?: string) {
  switch (categoria?.toLowerCase()) {
    case 'coletiva':
      return 'from-blue-500 to-blue-600';
    case 'individual':
      return 'from-green-500 to-green-600';
    case 'equipe':
      return 'from-purple-500 to-purple-600';
    case 'resistência':
      return 'from-orange-500 to-orange-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
}
