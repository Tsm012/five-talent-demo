import HomesRepository from '../../repositories/homes-repository'



export default async (req, res) => {
    
    switch(req.method) {
        case 'PUT':
            
            if(req.body.MLSNumber === undefined){
                res.statusCode = 400;
                res.json({error: "MLS Number Required"});    
                return;
            }
    
            var homesRepository = new HomesRepository(process.env.mongodbConnectionString);

            var home = await homesRepository.GetHome(req.body.MLSNumber);

            // console.log(home);
            // console.log(req.body);

            //Don't insert Duplicate MLS numbers
            if(home !== null && home._id.toString() !== req.body._id){
                res.statusCode = 400;
                res.json({error: "MLS Number Already Exists"});    
                return;
            }

            await homesRepository.UpdateHome(req.body);

            var homes = await homesRepository.GetHomes();

            console.log(homes);

            res.statusCode = 200;
            res.json(homes);
          break;
        case 'POST':
            
            if(req.body.MLSNumber === undefined){
                res.statusCode = 400;
                res.json({error: "MLS Number Required"});    
                return;
            }
    
            var homesRepository = new HomesRepository(process.env.mongodbConnectionString);

            var home = await homesRepository.GetHome(req.body.MLSNumber);

            //Don't insert Duplicate MLS numbers
            if(home !== null){
                res.statusCode = 400;
                res.json({error: "MLS Number Already Exists"});    
                return;
            }
            
            await homesRepository.CreateHome(req.body);

            var homes = await homesRepository.GetHomes();

            
    
            res.statusCode = 200;
            res.json(homes);
          break;
        case 'DELETE':
            
            if(req.body.MLSNumber === undefined){
                res.statusCode = 400;
                res.json({error: "MLS Number Required"});    
                return;
            }

            var homesRepository = new HomesRepository(process.env.mongodbConnectionString);

            await homesRepository.DeleteHome(req.body);

            var homes = await homesRepository.GetHomes();
    
            res.statusCode = 200;
            res.json(homes);  
        default:
            res.statusCode = 404;
      }
}
