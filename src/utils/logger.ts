import chalk from 'chalk'
import ora, {Ora} from 'ora'

class Logger {
  private spinner: Ora | null = null

  info(message: string): void {
    if (this.spinner) this.spinner.stop()
    console.log(chalk.blue('ℹ'), message)
  }

  success(message: string): void {
    if (this.spinner) this.spinner.stop()
    console.log(chalk.green('✓'), message)
  }

  warn(message: string): void {
    if (this.spinner) this.spinner.stop()
    console.log(chalk.yellow('⚠'), message)
  }

  error(message: string): void {
    if (this.spinner) this.spinner.stop()
    console.log(chalk.red('✗'), message)
  }

  start(message: string): Ora {
    if (this.spinner) this.spinner.stop()
    this.spinner = ora(message).start()
    return this.spinner
  }

  stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop()
      this.spinner = null
    }
  }
}

export const logger = new Logger()
