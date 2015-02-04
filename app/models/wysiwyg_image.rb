#encoding: UTF-8

class WysiwygImage
  include Mongoid::Document
  include Mongoid::Paperclip
  include Mongoid::Timestamps
  # extend Mongoid::PaperclipQueue  

  store_in collection: "wysiwyg_image", database: "dishgo"

  field :url, type: String 
  belongs_to :restaurant, class_name: "Restaurant", index: true, inverse_of: :website_images
  belongs_to :user, class_name: "User", index: true, inverse_of: :website_images

  has_mongoid_attached_file :img, {
      :path           => ':hash_:style.png',
      :hash_secret => "we_like_food",
      :styles => {
        :original => { res_ize: '670x999999999>' },
      },
      :processors => [:converter, :compressor],          
      storage: :fog,
      fog_credentials: {
        provider: 'Rackspace',
        rackspace_username: 'ptolts',
        rackspace_api_key: RACKSPACE_KEY,
        rackspace_region: :iad,
        persistent: false
      },
      fog_directory: 'wysiwyg_editor',
      fog_public: true,
    }

  field :manual_img_fingerprint, type: String
  validates_attachment_content_type :img, :content_type => %w(image/jpeg image/jpg image/png), :message => 'file type is not allowed (only jpeg/png/gif images)'    
  after_post_process :img_post_process

  def url
    return super.to_s.gsub(/http:\/\//,'https://').gsub(/\.r.{2}\./,'.ssl.')
  end

  def custom_to_hash
    if img_file_size
      if self.url.nil?
        img_post_process
      end      
      return {_id: _id, id: _id, url: self.url, name: self.name}
    end
  end

  def serializable_hash options
    start = super {}
    start[:id] = self._id
    start[:_id] = self._id
    start[:url] = self.url
    start
  end

  def img_post_process
    self.url = img.url(:original) 
  end

  # private
  def reprocess_img
    img.reprocess!
    img_post_process 
  end  

end



