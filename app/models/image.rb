#encoding: UTF-8

class Image
  include Mongoid::Document
  include Mongoid::Paperclip
  include Mongoid::Timestamps
  # extend Mongoid::PaperclipQueue

  store_in collection: "image", database: "dishgo"
  field :local_file, type: String
  field :original_url, type: String
  field :tags, type: Array
  field :original_json, type: String
  field :description, type: String
  field :likes, type: Integer
  field :source, type: String
  field :position, type: Integer
  field :rejected, type: Boolean, default: false
  field :unverified, type: Boolean, default: true

  field :img_url_medium, type: String
  field :img_url_original, type: String
  field :img_url_small, type: String
  field :background_processed, type: Boolean, default: false  

  field :text_found, type: String
  field :local_file_face, type: String

  field :height, type: Integer
  field :width, type: Integer  

  belongs_to :user, class_name: "User", inverse_of: :dish_images, index: true

  belongs_to :restaurant, class_name: "Restaurant", inverse_of: :image, index: true
  belongs_to :restaurant_gallery, class_name: "Restaurant", inverse_of: :gallery_images, index: true

  belongs_to :dish, index: true
  
  index({ _id:1 }, { unique: true, name:"id_index" })

  scope :rejected, -> { ne(rejected: true) }
  default_scope -> { ne(unverified: true) } 

  has_mongoid_attached_file :img, {
      :path           => ':hash_:style.png',
      :hash_secret => "we_like_food",
      :styles => {
        :original => { res_ize: '1920x999999999>' },
        :small    => { res_ize: '100x99999999>' },
        :medium   => { res_ize: '420x999999999>' },
      },
      :processors => [:converter, :compressor],      
      storage: :fog,
      fog_credentials: {
        provider: 'Rackspace',
        rackspace_username: 'ptolts',
        rackspace_api_key: 'e9ba2a6e93591ce985a47ffada9d02d5',
        rackspace_region: :iad,
        persistent: false
      },
      fog_directory: 'Images',
      fog_public: true,
    }

  field :img_fingerprint, type: String
  field :manual_img_fingerprint, type: String
  validates_attachment_content_type :img, :content_type => %w(image/jpeg image/jpg image/png), :message => 'file type is not allowed (only jpeg/png/gif images)'    
  after_post_process :img_post_process
  before_post_process :fuck_you_paperclip

  def fuck_you_paperclip
    if @background_process
      return true
    else
      return false
    end
  end

  def do_background_work
    @background_process = true
    img.reprocess!
  end

  def img_url_medium
    return super.to_s.gsub(/http:\/\//,'https://').gsub(/\.r.{2}\./,'.ssl.')
  end

  def img_url_original
    return super.to_s.gsub(/http:\/\//,'https://').gsub(/\.r.{2}\./,'.ssl.')
  end

  def img_url_small
    return super.to_s.gsub(/http:\/\//,'https://').gsub(/\.r.{2}\./,'.ssl.')
  end    

  def custom_to_hash
    if img_file_size
      # This is for legacy images which didn't have their URL's saved.
      if self.img_url_medium.nil?
        img_post_process
      end      
      return {_id: _id, id: _id, local_file: self.img_url_medium, medium: self.img_url_medium, rejected: false, original: self.img_url_original}
    else
      return {_id: self._id, id: self._id, local_file: self.local_file, medium: self.img_url_medium, rejected: self.rejected, original: self.img_url_original}
    end
  end

  def serializable_hash options
    options ||= {}
    if options[:ios]
      return super({})
    end
    if self.img_file_size
      # This is for legacy images which didn't have their URL's saved.
      if self.img_url_medium.nil?
        img_post_process
      end   
      return {_id: self._id, id: self._id, local_file: img_url_medium, medium: self.img_url_medium, small: self.img_url_small, rejected: self.rejected, original: self.img_url_original}
    else
      return {_id: self._id, id: self._id, local_file: self.local_file, medium: self.img_url_medium, small: self.img_url_small, rejected: self.rejected, original: self.img_url_original}
    end
  end

  def img_post_process
    Rails.logger.warn "img_post_process"
    # if self.img_post_process_complete
      self.img_url_medium = img.url(:medium) 
      self.img_url_small = img.url(:small) 
      self.img_url_original = img.url(:original) 
    # else
    #   self.img_url_original = img.url(:original) 
    #   self.img_url_medium = self.img_url_original 
    #   self.img_url_small = self.img_url_original 
    # end
    tempfile = img.queued_for_write[:original]
    unless tempfile.nil?
      geometry = Paperclip::Geometry.from_file(tempfile)
      self.manual_img_fingerprint = Digest::MD5.hexdigest(File.open(tempfile.path).read)
      self.width = geometry.width.to_i
      self.height = geometry.height.to_i
      self.img_file_size = tempfile.size
    end
  end

  def set_coordinates coords
    @coordinates = coords
  end

  def get_coordinates 
    @coordinates
  end  

  def cropping?
    !@coordinates.nil?
  end

  def image_geometry(style = :original)
    @geometry ||= {}
    path = (img.options[:storage]==:fog) ? img.url(style) : img.path(style)
    @geometry[style] ||= Paperclip::Geometry.from_file(path)
  end

  # # private
  # def reprocess_img
  #   img.assign(img)
  #   img.save
  # end  

end



