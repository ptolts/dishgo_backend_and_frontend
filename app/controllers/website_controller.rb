class WebsiteController < ApplicationController
	before_filter :authenticate_user!
	before_filter :admin_user!, :only => [:create, :update]
	before_filter :admin_or_owner!, :only => [:set_design]
	layout 'administration'


end
