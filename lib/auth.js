import { getServerSession } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

export const authConfig = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'identify email guilds'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.discordId = profile.id
        token.discordTag = `${profile.username}#${profile.discriminator}`
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.discordId = token.discordId
      session.user.discordTag = token.discordTag
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign in
      if (url === baseUrl) {
        return `${baseUrl}/dashboard`
      }
      return url
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  }
}

export async function getAuthSession() {
  return await getServerSession(authConfig)
} 