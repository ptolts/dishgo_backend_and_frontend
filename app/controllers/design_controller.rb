class DesignController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_user!, :only => [:create]
  before_filter :admin_or_owner!, :only => [:set_design]
  layout 'administration'

  def create
    css = params[:css]
    name = params[:name]
    design = Design.new
    design.css = css
    design.name = name
    design.save
    render :text => "{\"success\":\"true\"}"
  end

  def list
    render :text => Design.all.as_json
  end

end
