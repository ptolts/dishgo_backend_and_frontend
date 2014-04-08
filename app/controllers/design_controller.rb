class DesignController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admin_user!, :only => [:create, :update, :destroy, :upload_image, :create_image]
  before_filter :admin_or_owner!, :only => [:set_design]
  before_filter :admin_or_image_owner!, :only => [:destroy_image]
  layout 'administration'

  def create
    design = Design.create
    render :json => design.as_json
  end

  def list
    @templates = Dir.glob("#{Rails.root}/custom_templates/*").reject{|e| !File.directory?(e)}
    @image_templates = Dir.glob("#{Rails.root}/custom_image_css/*").reject{|e| !File.directory?(e)}
    @designs = Design.all.as_json({include: {global_images: {include: :global_images}}})
    render 'list' 
  end

  def fonts
    @templates = Dir.glob("#{Rails.root}/custom_fonts/*").reject{|e| !File.directory?(e)}    
    @fonts = Font.all.as_json
    render 'fonts' 
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
    design.fonts = data["fonts"]
    design.name = data["name"]
    design.template_location = data["template_location"]

    # design.images = data["images"].inject({}){|res,x|
    #   res[x["name"]] = x["url"]["url"]
    #   res
    # }

    (data["global_images"] + data["carousel"]).each do |gi|
      next if gi["id"].blank?
      g = GlobalImage.where(id:gi["id"]).first
      next unless g
      g.name = gi["name"]
      # g.css = gi["css"]
      g.customizable = gi["customizable"]
      g.carousel = gi["carousel"]
      if !gi["carousel"] and gi["global_images"].size == 0
        g.destroy
        next
      end
      sub_imgs = gi["global_images"].collect do |sgi|
        next if sgi["id"].blank?
        sg = GlobalImage.find(sgi["id"])
        if sg.img_url_original.blank?
          sg.destroy
          next
        end
        Rails.logger.warn "----------\n#{sg.img_url_original}\n-------"
        sg.name = gi["name"]
        sg.template_location = sgi["template_location"]
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
    render :json => {success:"Updated #{design.name}"}.as_json
  end

  def destroy
    design = Design.where(id:params[:id]).first
    design.destroy
    render :text => "Destroyed"
  end

  def upload_image
    data = JSON.parse(params[:data])
    file = params[:files]

    if !data["example_image"].blank?
      img = GlobalImage.where(id:data["id"]).first
      if !img
        img = GlobalImage.create
      end
      img.update_attributes({:img => file})
      img.example_image = true
      img.save
      des = Design.find(params[:design_id])
      des.example_image = img unless des.example_image == img
      des.save
      Rails.logger.warn "UPLOADING DEMO IMAGE"
      render :json => {files:[{
                    image_id: img.id,
                    name: img.name,
                    url:  img.img_url_original,
                  }]
                }.as_json 
      return
    end

    img = GlobalImage.where(id:params[:parent_id]).first
    if !img
      img = GlobalImage.create
    end
    if !img.design
      img.design = Design.find(params[:design_id])
    end

    img.name = params[:name]

    if carous = params[:carousel] and !carous.blank? and !['undefined','null','false'].any?{|e| e == carous.to_s }
      img.update_attributes({:img => file})
      img.save
      render :json => {files:[{
                          image_id: img.id,
                          name: img.name,
                          url:  img.img_url_original,
                        }]
                      }.as_json 
      return     
    else
      if g_id = data["id"] and !g_id.blank?
        sub_img = GlobalImage.find(g_id)
      else
        sub_img = GlobalImage.create
        img.global_images << sub_img        
      end
      sub_img.name = params[:name]
      sub_img.update_attributes({:img => file})
      sub_img.save
      img.save
      render :json => {files:[{
                          image_id: sub_img.id,
                          name: sub_img.name,
                          url:  sub_img.img_url_original,
                        }]
                      }.as_json   
      return   
    end
  end  

  def create_image
    img = GlobalImage.create
    # img.design = Design.find(params[:design_id])
    img.save
    render :json => img.as_json
  end

  def destroy_image
    image = GlobalImage.find(params[:image_id])
    image.global_images.each do |img|
      img.destroy
    end
    image.destroy
    render :json => {"Success"=>true}.as_json
  end  

  def update_font
    data = JSON.parse(params[:data])    
    font = Font.find(data["id"])
    font.link = data["link_data"]
    font.template_location = data["template_location"]
    font.name = data["name"]
    font.css = data["css"]
    font.save
    render :json => {"success" => true}.as_json
  end

  def create_font
    font = Font.create
    render :json => font.as_json
  end  

  def destroy_font 
    # data = JSON.parse(params[:data])
    # data = params[:data]
    font = Font.find(params["id"])
    font.destroy
    render :json => {"success" => true}.as_json
  end

end
