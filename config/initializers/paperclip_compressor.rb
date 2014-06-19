module Paperclip
  class Compressor < Processor
    def initialize(file, options = {}, attachment = nil)
      super
      # Rails.logger.warn options.to_s
      @file = file
      @path = @file.path
      cmd = "file -b --mime-type #{@file.path}"
      # Rails.logger.warn "cmd: #{cmd}"
      @extension = `#{cmd}`
      @extension = @extension.to_s.gsub(/image\//,'').strip
      # Rails.logger.warn "EXTENSION: #{@extension}"
    end
    def make
      convert @path
      dst = File.open @path
    end
    def convert infile
      cmd = "#{infile}"
      if ['jpg','jpeg'].include?(@extension)
        begin
         success = Paperclip.run('jpegoptim', cmd)
        rescue => msg
          Rails.logger.warn "There was an error processing the preview for #{msg.to_s}"
          raise msg
        end
      elsif ['png'].include?(@extension)
        begin
         success = Paperclip.run('optipng', cmd)
        rescue => msg
          Rails.logger.warn "There was an error processing the preview for #{msg.to_s}"
          raise msg
        end
      end
    end
  end
end

module Paperclip
  class Converter < Processor
    def initialize(file, options = {}, attachment = nil)
      super
      # Rails.logger.warn options.to_s
      # Rails.logger.warn "PATH: #{file.path}"
      @file           = file
      @path           = file.path
      @attachment     = attachment
      @size           = options[:res_ize]
      @current_format = File.extname(@file.path) 
      @format         = options[:format]
      @basename       = File.basename(@file.path, @current_format)
    end
    def make
      dst = Tempfile.new([@basename, "." + (@format ? @format : @current_format)])
      dst_path = File.expand_path(dst.path)
      convert @path, dst_path
      File.open(dst_path)
    end
    def convert infile, outfile
      # Rails.logger.warn `ls -al #{infile}`
      cmd = "'#{infile}' -auto-orient -resize '#{@size}' -strip '#{outfile}'"
      begin
       success = Paperclip.run('convert', cmd)
      rescue PaperclipCommandLineError
        raise PaperclipError, "There was an error processing the preview for #{@basename}" if whiny
      end
    end
  end
end