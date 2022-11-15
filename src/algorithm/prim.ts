export function prim(map: number[][]): boolean[][] {
  const result: boolean[][] = []
  const visited: boolean[] = []
  // from, to, weight
  const edges: [number, number, number][] = new Array(map.length).fill(0).map(() => [,, Infinity])
  edges[0] = [0, 0, 0]
  for (let i = 0; i < map.length; i++) {
    const [from, to] = edges.reduce((acc, edge, to) => {
      return visited[to] || acc[2] <= edge[2] ? acc : edge
    }, [0, -1, Infinity])
    if (to === -1) throw new Error()
    visited[to] = true
    ;(result[from] ||= [])[to] = true
    ;(result[to] ||= [])[from] = true
    for (let j = 0; j < map.length; j++) {
      if (!visited[j]
        && Number.isFinite(map[to][j])
        && map[to][j] < edges[j][2]) {
          edges[j] = [to, j, map[to][j]]
      }
    }
  }
  return result.map((row, i) => row.map((node, j) => i === j ? false : node))
}