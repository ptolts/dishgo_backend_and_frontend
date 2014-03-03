class DemoController < ApplicationController

  layout 'administration'
  after_filter :set_access_control_headers

  def set_access_control_headers 
    headers['Access-Control-Allow-Origin'] = '*' 
    # headers['Access-Control-Allow-Origin'] = 'http://dev.foodcloud.ca' 
  end

  def upload_image
    file = params[:files]
    md5_sum = Digest::MD5.hexdigest(file.read)
    if img = Demoimage.where(:manual_img_fingerprint => md5_sum).first and img
      Rails.logger.warn "Duplicate file. No need to upload twice."
      images = [img]
    else
      img = Demoimage.create
      img.update_attributes({:img => file})
      img.manual_img_fingerprint = md5_sum
      img.save
      images = [img]
    end

  
    render :json => {files: images.collect{ |img|
                      {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        thumbnailUrl:   img.img_url_medium,
                        original:  img.img_url_original,
                        height: img.height,
                        width: img.width,
                      }
                    }}.as_json
  end

  def upload_icon
    file = params[:files]

    md5_sum = Digest::MD5.hexdigest(file.read)
    if img = Demoicon.where(:manual_img_fingerprint => md5_sum).first and img
      Rails.logger.warn "Duplicate file. No need to upload twice."
      images = [img]
    else
      img = Demoicon.create
      img.update_attributes({:img => file})
      img.manual_img_fingerprint = md5_sum
      img.save
      images = [img]
    end
  
    render :json => {files: images.collect{ |img|
                      {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        thumbnailUrl:   img.img_url_icon,
                        original:  img.img_url_original,
                        height: img.height,
                        width: img.width,                        
                      }
                    }}.as_json
  end  

  def crop_icon

    if img = Demoicon.find(params[:image_id]) and img
      img.set_coordinates(params[:coordinates])
      img.reprocess_img
      img.save(:validate=>false)
    end
  
    render :json =>  {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        thumbnailUrl:   img.img_url_medium,
                        original:  img.img_url_original,
                        height: img.height,
                        width: img.width,
                      }.as_json    
  end  

  def index
    render 'demo'
  end

  def crop_image

    if img = Demoimage.find(params[:image_id]) and img
      img.set_coordinates(params[:coordinates])
      img.reprocess_img
      img.save(:validate=>false)
    end
  
    render :json =>  {
                        image_id: img.id,
                        name: img.img_file_name,
                        size: img.img_file_size,
                        thumbnailUrl:   img.img_url_medium,
                        original:  img.img_url_original,
                        height: img.height,
                        width: img.width,
                      }.as_json    
  end

end
