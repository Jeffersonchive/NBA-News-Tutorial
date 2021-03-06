// Modules
import React from "react";
import { Route, Switch } from "react-router-dom";

// Components

import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import Dashboard from "./components/Dashboard/Dashboard";
import News from "./components/Articles/News/Main/index";
import VideosMain from "./components/Articles/Videos/Main/index";
import NewsArticle from "./components/Articles/News/Post/index";
import VideoArticle from "./components/Articles/Videos/Video/index";
import Layout from "./hoc/Layout/Layout";

// Routing

import PrivateRoute from "./components/AuthRoutes/privateroutes";
import PublicRoute from "./components/AuthRoutes/publicroutes";

// Styling

// Logic

const Routes = (props) => {
	return (
		<Layout user={props.user}>
			<Switch>
				<Route path="/" exact component={Home} />
				<PublicRoute
					{...props}
					restricted={true}
					path="/sign-in"
					exact
					component={SignIn}
				/>
				<PrivateRoute
					{...props}
					path="/dashboard"
					exact
					component={Dashboard}
				/>
				<Route path="/news" exact component={News} />
				<Route path="/articles/:id" exact component={NewsArticle} />
				<Route path="/videos/:id" component={VideoArticle} />
				<Route path="/videos" exact component={VideosMain} />
			</Switch>
		</Layout>
	);
};

export default Routes;
