import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import * as readline from 'readline'
import 'dotenv/config'

const model = openai('gpt-4o-mini')

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const conversationHistory: Message[] = []

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const askUser = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

const chat = async () => {
  console.log('> Chat CLI started! Type "exit" to quit.\n')

  while (true) {
    const userInput = await askUser('You: ')

    if (userInput.toLowerCase() === 'exit') {
      console.log('\n=K Goodbye!')
      break
    }

    conversationHistory.push({ role: 'user', content: userInput })

    try {
      const { textStream } = await streamText({
        model,
        messages: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })

      process.stdout.write('\nAgent: ')

      let fullResponse = ''
      for await (const textPart of textStream) {
        process.stdout.write(textPart)
        fullResponse += textPart
      }

      // Add assistant response to history
      conversationHistory.push({ role: 'assistant', content: fullResponse })

      console.log('\n')

    } catch (error) {
      console.error('Error:', error)
      conversationHistory.pop()
    }
  }

  rl.close()
}

const main = async () => {
  await chat()
}

main().catch(console.error)