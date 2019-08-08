require "json"

package = JSON.parse(File.read(File.join(__dir__, "../package.json")))

Pod::Spec.new do |s|
  s.name         = package["name"]
  s.version      = package["version"]
  s.summary      = "react-native-phpfox-image"
  s.description  = <<-DESC
                  RNPhpfoxMobile
                   DESC
  s.homepage     = package["homepage"]
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/phpfox-mobile/react-native-phpfox-image.git", :tag => "master" }
  s.source_files  = "FastImage/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  s.dependency 'SDWebImage', '~> 4.4.3'
  s.dependency 'SDWebImage/GIF', '~> 4.4.3'
  #s.dependency 'SDWebImageWebPCoder', '~> 0.2.3'
end

