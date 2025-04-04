import { PrismaClient } from '@prisma/client'
import { addDays, startOfWeek, addWeeks, format } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Insertion des données...')

  // 1. Utilisateurs
  const users = await prisma.user.createMany({
    data: [
      { email:'alice.dupond@extia.fr', password:'sduhfsdighf', firstName: 'Alice', lastName: 'Dupont', photoUrl: 'https://picsum.photos/seed/alice/100' },
      { email:'bob.martin@extia.fr', password:'dbjbqsdq', firstName: 'Bob', lastName: 'Martin', photoUrl: 'https://picsum.photos/seed/bob/100' }
    ]
  })

  const userList = await prisma.user.findMany()

  // 2. Bureaux (1 indisponible)
  for (let i = 1; i <= 20; i++) {
    await prisma.desk.create({
      data: {
        deskNumber: i,
        isAvailable: i !== 13 // bureau 13 = HS
      }
    })
  }

  const desks = await prisma.desk.findMany({ where: { isAvailable: true } })

  // 3. Réservations sur 3 semaines
  const today = new Date()
  const startMonday = startOfWeek(today, { weekStartsOn: 1 })

  for (let week = 0; week < 3; week++) {
    for (let day = 0; day < 7; day++) {
      const date = addDays(addWeeks(startMonday, week), day)

      // Simuler des réservations aléatoires (5 à 10 par jour)
      const shuffledUsers = [...userList].sort(() => 0.5 - Math.random())
      const shuffledDesks = [...desks].sort(() => 0.5 - Math.random())
      const count = Math.floor(Math.random() * 6) + 5 // entre 5 et 10

      for (let i = 0; i < count && i < shuffledUsers.length && i < shuffledDesks.length; i++) {
        await prisma.reservation.create({
          data: {
            date,
            userId: shuffledUsers[i].id,
            deskId: shuffledDesks[i].id
          }
        })
      }
    }
  }

  console.log('✅ Données de seed insérées.')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
