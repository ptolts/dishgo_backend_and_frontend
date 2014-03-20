class DesignController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_user!, :only => [:create, :update, :destroy, :upload_image]
  before_filter :admin_or_owner!, :only => [:set_design]
  layout 'administration'

  def create
    design = Design.create
    render :json => design.as_json
  end

  def list
    @designs = Design.all.as_json({include: :global_images})
    render 'list' 
  end

  def update
    data = JSON.parse(params[:data])
    # render :json => data.to_json
    # return    
    design = Design.where(id:data["id"]).first
    unless design
      design = Design.new
    end
    design.css = data["css"]
    design.menu_css = data["menu_css"]
    design.name = data["name"]

    # design.images = data["images"].inject({}){|res,x|
    #   res[x["name"]] = x["url"]["url"]
    #   res
    # }

    (data["global_images"] + data["carousel"]).each do |gi|
      Rails.logger.warn "Saving #{gi.to_s}"
      g = GlobalImage.find(gi["id"])
      g.name = gi["name"]
      g.customizable = gi["customizable"]
      g.carousel = gi["carousel"]
      g.save
    end

    design.save
    render :text => "Updated #{design.name}"
  end

  def destroy
    design = Design.where(id:params[:id]).first
    design.destroy
    render :text => "Destroyed"
  end

  def upload_image
    file = params[:files]
    img = GlobalImage.where(id:params[:id]).first
    img = GlobalImage.create unless img
    img.name = params[:name]
    img.design = Design.find(params[:design_id])
    img.update_attributes({:img => file})
    img.save

    render :json => {files:[{
                        image_id: img.id,
                        name: img.name,
                        url:  img.img_url_original,
                      }]
                    }.as_json
  end  

end
