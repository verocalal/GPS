module.exports={
    topics: [      
        {
            title: "ahoraquetaltest",
            content: "ejemplo",
            category: "ejemplo",
            subcategory: "ejemplo",
            user: "ejemplo"
        },
        {
            title: "hola2",
            content: "ejemplo",
            category: "ejemplo",
            subcategory: "ejemplo",
            user: "ejemplo"
        },
        {
            title: "hola3",
            content: "content",
            category: "ejemplo",
            subcategory: "ejemplo",
            user: "ejemplo"
        },
        {
          user: 'ejemplogetTopicinfo1',
          title: 'ahoraquetal',
          category: 'ejemplo',
          subcategory: 'ejemplo',
          content: 'ejemplo',
        }       
    ],

    meetings: [
        { 
            user:"usuarioMeeting1", 
            title:"tituloMeeting1",
            subject :"subjectMeeting1", 
            datetime: "2020-05-20 10:00:00",
            comments :"comentariosMeeting1", 
            capacity : 2,
            location:"" ,
            state :"ACTIVO",
           
        },
        { 
            user:"usuarioMeeting2", 
            title:"tituloMeeting2",
            subject :"subjectMeeting2",
            datetime: "2020-05-20 10:00:00", 
            comments :"comentariosMeeting2", 
            capacity : 2, 
            location:"" ,
            state :"ACTIVO",            
        },
        { 
            user:"usuarioMeeting2", 
            title:"tituloMeeting2",
            subject :"subjectMeeting2",
            datetime: "2020-05-20 10:00:00", 
            comments :"comentariosMeeting2", 
            capacity : 4, 
            location:"" ,
            state :"ACTIVO",           
        }
    ],

    answers:[
        {
          user: "test1",
          content: "test1"
        },
        {
          user: "test2",
          content: "test2"
        },
        {
          user: "test3",
          content: "test3"
        },
        {
            user: "createtest1",
            content: "createtest1"
        },
        {
            id:-1,
            user: "createtest2",
            content: "createtest2"
        }
    ],
    asociations:[
        {
            name : "usuarioAsociation",
            email : "emailAsociation",
            description : "descriptionAsociation",
            social_media : "social_mediaAsociation",
            location : "locationAsociation",
            web: "webAsociation",
            logo: "ascii.png"
        },
        {
            name : "usuarioAsociation2",
            email : "emailAsociation2",
            description : "descriptionAsociation2",
            social_media : "social_mediaAsociation2",
            location : "locationAsociation2",
            web: "webAsociation2",
            logo: "ascii2.png"
        }    
    ],
    users:[
        {
            name: "usuarioUser",
            email: "emailUser",
            password:"passwordUser",
            date_birth: "1993-06-05",
            image: null,
            type_user: 1
        },
        {
           name: "usuarioUser2",
            email: "emailUser2",
            password:"passwordUser",
            date_birth: "1993-06-04",
            image: null,
            type_user: 1
        }
    ]    
}