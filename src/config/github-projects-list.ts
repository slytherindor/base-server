export interface IGithubProject {
  properName: string;
}
const projects: Record<string, IGithubProject> = {
  'base-server': {
    properName: 'Base Server',
  },
  'personal-portfolio-website': {
    properName: 'This Website',
  },
  starPrintIntegration: {
    properName: 'Printer iOS integration',
  },
  Virajment: {
    properName: 'Python form application',
  },
  'binance-order-placer': {
    properName: 'Binance Order Bot',
  },
  'AIND-sudoku': {
    properName: 'Sudoku Solver',
  },
  'aws-base-infra': {
    properName: 'AWS Base VPC template',
  },
  'stream-adventure': {
    properName: 'NodeJS Streams playground',
  },
};
export default projects;
