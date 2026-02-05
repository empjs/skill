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

  dim(message: string): void {
    if (this.spinner) this.spinner.stop()
    console.log(chalk.dim('  ' + message))
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

  /**
   * Update spinner text without stopping it
   */
  updateSpinner(message: string): void {
    if (this.spinner) {
      this.spinner.text = message
    }
  }

  /**
   * Log info without stopping spinner (for background info)
   */
  infoWithoutStop(message: string): void {
    if (this.spinner) {
      // Temporarily stop to show info, then restart
      const currentText = this.spinner.text
      this.spinner.stop()
      console.log(chalk.blue('ℹ'), message)
      this.spinner.start(currentText)
    } else {
      console.log(chalk.blue('ℹ'), message)
    }
  }
}

export const logger = new Logger()
