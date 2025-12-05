export default function getCategoryGradient(categoria?: string) {
  switch (categoria?.toLowerCase()) {
    case 'Coletivo':
      return 'from-blue-500 to-blue-600';
    case 'Individual':
      return 'from-green-500 to-green-600';
    case 'Duplas':
      return 'from-purple-500 to-purple-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
}
