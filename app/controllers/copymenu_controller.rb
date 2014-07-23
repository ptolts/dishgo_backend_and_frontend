require 'oj'

class CopymenuController < ApplicationController
  before_filter :admin_user!
  layout 'administration'

  def index

  end

  def search
    result = Restaurant.where(:name => /#{params[:restaurant_name]}/i)
    result = result.limit(25)
  	render :json => result.as_json(:include => [:menus])
  end

  def initiate_copy
    from = Restaurant.find(params["from"])
    to = Restaurant.find(params["to"])
    to.menus.destroy_all
    # if to.menus.count > 0
    #   render json:{success:false}, status: 500
    #   return
    # end
    to.copy_menu_from_restaurant from
    render json:{success:true}
  end
end
