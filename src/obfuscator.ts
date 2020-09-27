import {DockerfileParser, Dockerfile} from 'dockerfile-ast';

export class Obfuscator {
  private ast: Dockerfile;
  private commandMappings: Map<string, number>;
  private nextNumber: number;
  constructor(private readonly source: string) {
    this.ast = DockerfileParser.parse(source);
    this.nextNumber = 0;
    this.commandMappings = new Map();
    // console.log(this.ast);
  }
  private encryptCommand(cmd: string | null): string {
    if (!cmd) {
      return '';
    } else {
      if (this.commandMappings.has(cmd)) {
        return (this.commandMappings.get(cmd) || 0).toString();
      } else {
        return `csteps ${this.nextNumber++}`;
      }
    }
  }
  dumpEncrypted() {
    const instructions = this.ast.getInstructions();
    return instructions.map(ins => {
      if (ins.getKeyword() === 'RUN') {
        return `${ins.getKeyword()} ${this.encryptCommand(
          ins.getArgumentsContent()
        )}`;
      }
      return `${ins.getKeyword()} ${ins.getArgumentsContent()}`;
    });
  }
}
