import 'dotenv/config';
import '@/index';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import AdminRoute from './routes/admin.route';
import PostRoute from './routes/post.route';

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new AdminRoute(), new PostRoute()]);

app.listen();
