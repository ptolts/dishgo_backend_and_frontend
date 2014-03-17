class DesignController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_user!, :only => [:create, :update]
  before_filter :admin_or_owner!, :only => [:set_design]
  layout 'administration'

  def create
    css = params[:css]
    name = params[:name]
    design = Design.new
    design.css = css
    design.name = name
    design.save
    render :text => "Created Design called #{name}"
  end

  def list
    Rails.logger.warn request.protocol
    Rails.logger.warn "********"
    @designs = Design.all.as_json
    render 'list' 
  end

  def update
    design = Design.where(id:params[:id]).first
    unless design
      design = Design.new
    end
    design.css = params[:css]
    design.name = params[:name]
    design.save
    render :text => "Updated #{design.name}"
  end
end
