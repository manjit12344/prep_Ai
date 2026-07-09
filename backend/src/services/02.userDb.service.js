import { prisma } from "../config/config.js";

export async function setPre(userId, type, level, company) {
    const response = await prisma.interview.create({
        data: {
            userId, type, level, company
        }
    });
    return response;
}
export async function joinDetails(id) {
    const response = await prisma.interview.findUnique({
        where: {
            id: id
        },
    })
    return response;
}


// maine jawab dena hai..to ek json file dega...maine usse previous response ka data pre row me save karna hai aur new question row create karni hai
export async function handelFirst(id,aiChat){
    //handling new question & saving pre response of starter
        const response = await prisma.interviewResponse.create({
                data:{
                    interviewId:id,
                    question:aiChat.nextQuestion,
                    target:aiChat.target,
                    topic:aiChat.topic,  
                    answer:null,
                    score:0,
                }
            })
            return response.id;
}

export async function findFromDb(id){
    const response =  await prisma.interviewResponse.findMany({
        where:{interviewId:id,
            OR:[{question:{
              not:null
            }},
            {answer:{
              not:null
            }}]
        },
        orderBy:{
            id:'asc'
        }
     });

//   [
// { role: "user", parts: [{ text: "Hello" }] },
//   { role: "model", parts: [{ text: "Hi, let's start!" }] }
// ]
   let history = [];
   response.forEach(e => {
  history.push({
    role: "model",
    parts: [{ text: e.question }]
  });

  if (e.answer) {
    history.push({
      role: "user",
      parts: [{ text: e.answer }]
    });
  }
});
   return history;
}

export async function storeInDb(qId,id,aiChat,userResponse){
        const response1 = await prisma.interviewResponse.update({  //setting up old answer
            where:{id:qId},
            data:{
                score:aiChat.score,
                answer:userResponse
            }
        })
        const response2 = await prisma.interviewResponse.create({  //setting up newQuestion
            data:{
                interviewId:id,
                question:aiChat.nextQuestion,
                answer:null,
                target:aiChat.target,
                topic:aiChat.topic

            }

        })
        return response2.id;

}

