class DesignController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_user!, :only => [:create, :update, :destroy, :upload_image, :create_image]
  before_filter :admin_or_owner!, :only => [:set_design]
  layout 'administration'

  def create
    design = Design.create
    render :json => design.as_json
  end

  def list
    @designs = Design.all.as_json({include: {global_images: {include: :global_images}}})
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
      sub_imgs = gi["global_images"].collect do |sgi|
        next if sgi["id"].blank?
        sg = GlobalImage.find(sgi["id"])
        sg.name = gi["name"]
        sg.customizable = sgi["customizable"]
        sg.default_image = sgi["default_image"]
        sg.carousel = sgi["carousel"]
        sg.save
        sg
      end
      g.global_images = sub_imgs
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
    img = GlobalImage.where(id:params[:parent_id]).first
    # if !img
    #   img = GlobalImage.create
    # end
    img.name = params[:name]
    # img.design = Design.find(params[:design_id])
    sub_img = GlobalImage.create
    sub_img.name = params[:name]
    sub_img.update_attributes({:img => file})
    sub_img.save
    img.global_images << sub_img
    img.save

    render :json => {files:[{
                        image_id: sub_img.id,
                        name: sub_img.name,
                        url:  sub_img.img_url_original,
                      }]
                    }.as_json
  end  

  def create_image
    img = GlobalImage.create
    img.design = Design.find(params[:design_id])
    img.save
    render :json => img.as_json
  end

end
