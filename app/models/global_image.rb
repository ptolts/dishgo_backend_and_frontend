#encoding: UTF-8

class GlobalImage
  include Mongoid::Document
  include Mongoid::Paperclip
  include Mongoid::Timestamps

  store_in collection: "global_image", database: "dishgo"
  field :name, type: String

  field :img_url_original, type: String 

  belongs_to :design, index: true
  
  index({ _id:1 }, { unique: true, name:"id_index" })

  has_mongoid_attached_file :img, {
      :path           => ':hash_:style.png',
      :hash_secret => "we_like_food",      
      storage: :fog,
      fog_credentials: {
        provider: 'Rackspace',
        rackspace_username: 'ptolts',
        rackspace_api_key: 'e9ba2a6e93591ce985a47ffada9d02d5',
        rackspace_region: :iad,
        persistent: false
      },
      fog_directory: 'global_images',
      fog_public: true,
    }


  field :img_fingerprint, type: String
  field :manual_img_fingerprint, type: String
  validates_attachment_content_type :img, :content_type => %w(image/jpeg image/jpg image/png), :message => 'file type is not allowed (only jpeg/png/gif images)'    
  after_post_process :img_post_process

  def img_url_original
    return super.to_s.gsub(/http:\/\//,'https://').gsub(/\.r.{2}\./,'.ssl.')
  end

  def custom_to_hash
    if img_file_size
      # This is for legacy images which didn't have their URL's saved.
      if self.img_url_original.nil?
        img_post_process
      end      
      return {_id: _id, id: _id, url: self.img_url_original, name: self.name}
    end
  end

  def serializable_hash options
    if options[:ios]
      return super {}
    else
      return {_id: self._id, id: self._id, url: self.img_url_original, name: self.name}
    end
  end

  def img_post_process
    self.img_url_original = img.url(:original) 
  end

  # private
  def reprocess_img
    img.reprocess!
    img_post_process 
  end  

end



