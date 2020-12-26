import {migrator} from './database/migrator';
import {User} from './database/models/User';

migrator
  .up()
  .then(() => {
    console.log('MIGRATED');
  })
  .catch(err => {
    console.error(err);
  });
User.initialize();
User.create({
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'janedoe@email.com',
})
  .then(userInstance => {
    console.log(userInstance);
  })
  .catch(err => console.error(err));
User.destroy({where: {id: 2}})
  .then(r => console.log(r))
  .catch(err => console.error(err));
