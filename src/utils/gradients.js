// Shared with FestCard so a fest's color stays consistent between the
// browse grid and its own detail page — same id, same gradient, every time.
const GRADIENTS = [
  "from-violet-600 via-purple-600 to-indigo-600",
  "from-orange-500 via-amber-500 to-rose-500",
  "from-blue-600 via-indigo-600 to-violet-600",
  "from-pink-600 via-rose-500 to-orange-500",
];

export function gradientFor(id) {
  return GRADIENTS[id % GRADIENTS.length];
}
