import { PrismaClient } from "@prisma/client";
let prisma = new PrismaClient();

async function seed() {
  let panchoVilla = await prisma.user.create({
    data: {
      username: "panchoVilla",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u"
    }
  });
  await Promise.all([
    getJokes().map(joke => {
      let data = { jokesterId: panchoVilla.id, ...joke };
      return prisma.joke.create({ data });
    }),getBlogs().map(blog => {
      let data = { author: panchoVilla.id ,...blog }
      return prisma.blog.create({ data })
    })]
  );
}

seed();

function getJokes() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Road worker",
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`
    },
    {
      name: "Frisbee",
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`
    },
    {
      name: "Trees",
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`
    },
    {
      name: "Skeletons",
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`
    },
    {
      name: "Hippos",
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`
    },
    {
      name: "Dinner",
      content: `What did one plate say to the other plate? Dinner is on me!`
    },
    {
      name: "Elevator",
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`
    }
  ];
}


function getBlogs() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      name: "Building with Remix",
      content: `Build better websites with Remix and React Router. Remix brings the state of the art in web development without leaving behind the fundamentals. Build better websites with Remix and React Router. Remix brings the state of the art in web development without leaving behind the fundamentals. Build better websites with Remix and React Router. Remix brings the state of the art in web development without leaving behind the fundamentals.`,
      image: ''
    },
    {
      name: "Reusable components with accessibility in mind.",
      content: `React components with ref forwarding and a11y considerations.`,
      image: ''
    },

  ];
}
